import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

export class UploadBase64Dto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  data: string; // "data:image/png;base64,....."
}

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  async uploadFile(@Body() body: UploadBase64Dto) {
    if (!body.data || !body.filename) {
      throw new HttpException('Missing file or filename', HttpStatus.BAD_REQUEST);
    }
    
    // Parse data URL
    const matches = body.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new HttpException('Invalid base64 Data URL', HttpStatus.BAD_REQUEST);
    }
    
    try {
      const buffer = Buffer.from(matches[2], 'base64');
      const result = await this.cloudinaryService.uploadImage(buffer);
      
      return { url: result.secure_url };
    } catch (error) {
      console.error('Upload Error:', error);
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
