import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

let cachedApp: NestExpressApplication;

export async function getApp() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn'],
    });

    app.enableCors({
      origin: true,
      credentials: false,
    });

    // Global exception filter (same as local `main.ts`)
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Serve uploaded files
    if (process.env.NODE_ENV === 'production') {
      // On Vercel / serverless, Multer saves files to `/tmp`
      app.useStaticAssets('/tmp', {
        prefix: '/uploads/',
      });
    } else {
      // Local dev: serve from `./uploads` folder
      app.useStaticAssets(process.cwd() + '/uploads', {
        prefix: '/uploads/',
      });
    }

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}
