export declare class UploadBase64Dto {
    filename: string;
    data: string;
}
export declare class UploadController {
    uploadFile(body: UploadBase64Dto): Promise<{
        url: string;
    }>;
}
