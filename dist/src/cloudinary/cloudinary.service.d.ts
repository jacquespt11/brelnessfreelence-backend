import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
export declare class CloudinaryService {
    uploadImage(fileBuffer: Buffer): Promise<UploadApiResponse | UploadApiErrorResponse>;
}
