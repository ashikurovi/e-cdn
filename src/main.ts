import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      {
        logger: ['error', 'warn'],
      },
    );

    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: false,
    });

    // Global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Static files
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });

    await app.init();

    cachedApp = app;
  }

  return cachedApp;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const app = await createApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}

// ✅ Run locally
if (!process.env.VERCEL) {
  createApp().then(async (app) => {
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}