import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { UploadService } from './upload.service';
import { multerConfig } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Get base URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const publicUrl = await this.uploadService.uploadImage(file, baseUrl);

    return {
      success: true,
      message: 'Image uploaded successfully',
      url: publicUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
