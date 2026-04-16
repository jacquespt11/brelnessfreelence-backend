import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadBase64(dataUri: string): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(dataUri, { folder: 'brelness' });
  }

  async uploadImage(
    fileBuffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'brelness' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed with no result'));
          resolve(result);
        },
      );
      
      const stream = require('stream');
      const readable = new stream.Readable();
      readable._read = () => {}; // _read is required but you can noop it
      readable.push(fileBuffer);
      readable.push(null);
      
      readable.pipe(upload);
    });
  }
}
