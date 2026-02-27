export declare const multerConfig: {
    storage: any;
    fileFilter: (req: any, file: any, callback: any) => void;
    limits: {
        fileSize: number;
    };
};
export declare class UploadService {
    getPublicUrl(filename: string, baseUrl?: string): string;
}
