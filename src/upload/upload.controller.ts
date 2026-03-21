import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

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
    
    const buffer = Buffer.from(matches[2], 'base64');
    const extension = path.extname(body.filename) || '.jpg';
    
    // Generate safe name
    const safeName = Date.now() + '-' + Math.round(Math.random() * 1E9) + extension;
    
    // Ensure directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);
    
    const url = `http://localhost:3001/public/uploads/${safeName}`;
    
    return { url };
  }
}
