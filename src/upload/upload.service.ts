import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';
import { put } from '@vercel/blob';

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const allowedExtensions = ['.jpeg', '.jpg', '.png', '.webp'];

const isProduction = process.env.NODE_ENV === 'production';

export const multerConfig = {
  storage: isProduction
    ? memoryStorage()
    : diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
  fileFilter: (req, file, callback) => {
    const ext = extname(file.originalname).toLowerCase();
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(ext);

    if (isValidMimeType && isValidExtension) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          `Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`,
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
};

@Injectable()
export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
    baseUrl?: string,
  ): Promise<string> {
    if (isProduction) {
      if (!file.buffer) {
        throw new BadRequestException('File buffer is missing');
      }

      const ext = extname(file.originalname).toLowerCase();
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}${ext}`;

      const blob = await put(`uploads/${filename}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
      });

      return blob.url;
    }

    if (!file.filename) {
      throw new BadRequestException('Filename is missing');
    }

    if (baseUrl) {
      return `${baseUrl}/uploads/${file.filename}`;
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new BadRequestException(
        'BACKEND_URL is not configured for generating image URL',
      );
    }
    return `${backendUrl}/uploads/${file.filename}`;
  }
}

