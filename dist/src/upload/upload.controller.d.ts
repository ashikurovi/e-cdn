import type { Request } from 'express';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File, req: Request): Promise<{
        success: boolean;
        message: string;
        url: string;
        filename: any;
        originalName: any;
        size: any;
        mimetype: any;
    }>;
}
