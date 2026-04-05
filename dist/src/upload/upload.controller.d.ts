import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class UploadBase64Dto {
    filename: string;
    data: string;
}
export declare class UploadController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadFile(body: UploadBase64Dto): Promise<{
        url: any;
    }>;
}
