# Image CDN Service

A NestJS-based image CDN service that handles image uploads and serves them as static files. This service provides a simple API for uploading images and automatically generates public URLs for accessing them.

## Overview

This service allows you to:
- Upload images (JPEG, JPG, PNG, WEBP)
- Automatically validate file types and sizes
- Generate unique filenames to prevent conflicts
- Serve uploaded images as static files
- Get public URLs for uploaded images

## How It Works

### Architecture

The service is built with NestJS and consists of:

1. **Upload Controller** (`src/upload/upload.controller.ts`)
   - Handles POST requests to `/upload/image`
   - Validates uploaded files
   - Returns image metadata and public URL

2. **Upload Service** (`src/upload/upload.service.ts`)
   - Configures Multer for file handling
   - Validates file types and sizes
   - Generates unique filenames
   - Constructs public URLs

3. **Main Application** (`src/main.ts`)
   - Configures CORS for allowed origins
   - Serves static files from `/uploads/` directory
   - Starts the server on port 8000 (or PORT env variable)

### File Upload Flow

1. **Client sends POST request** to `/upload/image` with a file in the `file` field
2. **Multer interceptor** processes the file using the configured settings
3. **File validation** checks:
   - MIME type (must be: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`)
   - File extension (must be: `.jpeg`, `.jpg`, `.png`, `.webp`)
   - File size (maximum 10MB)
4. **File storage** saves the file to `./uploads/` directory with a unique filename
5. **Response** returns JSON with:
   - Success status
   - Public URL to access the image
   - File metadata (filename, original name, size, MIME type)

### File Naming

Files are automatically renamed to prevent conflicts:
- Format: `{timestamp}-{randomNumber}.{extension}`
- Example: `1768673800108-386916113.png`
- This ensures unique filenames even if multiple files are uploaded simultaneously

### Static File Serving

Uploaded images are served as static files:
- Base path: `/uploads/{filename}`
- Example: `http://localhost:8000/uploads/1768673800108-386916113.png`
- Files are accessible via GET requests without authentication

## API Endpoints

### POST `/upload/image`

Upload an image file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the image

**Response (Success):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "http://localhost:8000/uploads/1768673800108-386916113.png",
  "filename": "1768673800108-386916113.png",
  "originalName": "my-image.png",
  "size": 245678,
  "mimetype": "image/png"
}
```

**Response (Error):**
```json
{
  "statusCode": 400,
  "message": "No file uploaded" // or "Invalid file type. Only .jpeg, .jpg, .png, .webp are allowed."
}
```

## Configuration

### Environment Variables

- `PORT` (optional): Server port (default: 8000)
- `BACKEND_URL` (optional): Base URL for generating public URLs (fallback if not provided in request)

### CORS Configuration

The service allows requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://squadlog.up.railway.app`
- `https://squadlog-console.up.railway.app`

### File Restrictions

- **Allowed types**: JPEG, JPG, PNG, WEBP
- **Maximum size**: 10MB
- **Storage location**: `./uploads/` directory

## Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:8000/upload/image \
  -F "file=@/path/to/your/image.png"
```

### Using JavaScript (Fetch API)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:8000/upload/image', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log('Image URL:', data.url);
```

### Using Axios

```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('file', file);

const response = await axios.post('http://localhost:8000/upload/image', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

console.log('Image URL:', response.data.url);
```

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start in development mode
npm run start:dev

# Start in production mode
npm run start:prod
```

## Project Structure

```
src/
├── main.ts                 # Application entry point, CORS, static file serving
├── app.module.ts           # Root application module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
└── upload/
    ├── upload.module.ts    # Upload feature module
    ├── upload.controller.ts # Upload endpoint controller
    └── upload.service.ts   # Upload logic and Multer configuration
```

## Development

```bash
# Development mode with hot reload
npm run start:dev

# Debug mode
npm run start:debug

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint
```

## Important Notes

1. **File Storage**: Files are stored in the `./uploads/` directory. Make sure this directory exists or is created automatically.

2. **Security**: Currently, the service serves files without authentication. Consider adding authentication/authorization for production use.

3. **File Cleanup**: The service doesn't automatically delete old files. You may want to implement a cleanup mechanism for production.

4. **CORS**: Update the CORS origins in `src/main.ts` if you need to allow additional domains.

5. **File Size**: The 10MB limit can be adjusted in `src/upload/upload.service.ts` in the `multerConfig.limits.fileSize` property.

## License

UNLICENSED
