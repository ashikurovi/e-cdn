import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://squadlog.up.railway.app', 'https://squadlog-console.up.railway.app', 'https://squadcart-console.up.railway.app', 'https://squadcart-console.up.railway.app', 'https://karigoriongon-console.up.railway.app', 'https://karigoriongon-frontend.up.railway.app', 'https://karigoriongon.com', 'https://karigoriongon.com/sojibdotdev'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
