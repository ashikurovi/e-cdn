import type { Request } from 'express';
import type { Multer } from 'multer';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Multer.File, req: Request): Promise<{
        success: boolean;
        message: string;
        url: string;
        originalName: any;
        size: any;
        mimetype: any;
    }>;
}
