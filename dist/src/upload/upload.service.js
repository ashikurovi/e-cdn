"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = exports.allowedMimeTypes = void 0;
const common_1 = require("@nestjs/common");
exports.allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];
let UploadService = class UploadService {
    validateFile(file) {
        const isValidMimeType = exports.allowedMimeTypes.includes(file.mimetype);
        if (!isValidMimeType) {
            throw new common_1.BadRequestException(`Invalid file type. Only ${exports.allowedMimeTypes.join(', ')} are allowed.`);
        }
        if (!file.buffer || file.size === 0) {
            throw new common_1.BadRequestException('Uploaded file is empty');
        }
    }
    async getPublicUrlForBuffer(file, baseUrl) {
        const origin = baseUrl ||
            process.env.BACKEND_URL ||
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : 'http://localhost:5000');
        const safeName = encodeURIComponent(file.originalname);
        return `${origin}/images/${safeName}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map