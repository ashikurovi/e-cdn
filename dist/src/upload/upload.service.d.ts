import type { Multer } from 'multer';
export declare const allowedMimeTypes: string[];
export declare class UploadService {
    validateFile(file: Multer.File): void;
    getPublicUrlForBuffer(file: Multer.File, baseUrl?: string): Promise<string>;
}
