import { Controller, Post, Body, HttpStatus, Logger, HttpException, UploadedFile, UseInterceptors, ParseFilePipeBuilder } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MinioService } from '../../infrastructure/minio/minio.service';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

export class PresignedUrlRequestDto {
  @ApiProperty({
    description: 'The filename to be used for the uploaded file',
    example: 'video.mp4',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'The folder to store the file in',
    example: 'videos',
    default: 'uploads',
  })
  @IsString()
  @IsOptional()
  folder?: string = 'uploads';

  @ApiProperty({
    description: 'How long the URL will be valid (in seconds)',
    example: 600,
    default: 600,
  })
  @IsNumber()
  @IsOptional()
  expiryInSeconds?: number = 600; // 10 minutes

  @ApiProperty({
    description: 'Content type of the file being uploaded',
    example: 'video/mp4',
  })
  @IsString()
  @IsOptional()
  contentType?: string;
}

export class PresignedUrlResponseDto {
  @ApiProperty({
    description: 'The presigned URL for direct upload',
  })
  url: string;

  @ApiProperty({
    description: 'The object name in MinIO storage',
  })
  objectName: string;

  @ApiProperty({
    description: 'The public URL where the file will be accessible after upload',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Instructions for frontend on how to use the presigned URL',
  })
  instructions: string;
}

export class FileUploadResponseDto {
  @ApiProperty({
    description: 'The URL of the uploaded file',
    example: 'https://minio.example.com/bucket/uploads/123456-image.jpg',
  })
  fileUrl: string;

  @ApiProperty({ 
    description: 'The original filename',
    example: 'image.jpg',
  })
  filename: string;

  @ApiProperty({ 
    description: 'The MIME type of the file',
    example: 'image/jpeg',
  })
  mimeType: string;
}

export class FileUploadDto {
  @ApiProperty({ 
    type: 'string', 
    format: 'binary',
    description: 'The file to upload (image or video)',
  })
  file: any;

  @ApiProperty({
    description: 'The folder to store the file in',
    example: 'uploads',
    default: 'uploads',
    required: false,
  })
  @IsString()
  @IsOptional()
  folder?: string;
}

@ApiTags('uploads')
@Controller('uploads')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly minioService: MinioService,
  ) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'Generate a presigned URL for direct file upload' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully generated presigned URL',
    type: PresignedUrlResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getPresignedUrl(
    @Body() request: PresignedUrlRequestDto,
  ): Promise<PresignedUrlResponseDto> {
    try {
      const { filename, folder, expiryInSeconds, contentType } = request;
      
      if (!filename) {
        throw new HttpException('Filename is required', HttpStatus.BAD_REQUEST);
      }
      
      // Use the enhanced method to get both URL and file info
      const result = await this.minioService.generatePresignedUrlWithObjectInfo(
        filename,
        folder || 'videos',
        expiryInSeconds || 600,
        contentType,
      );
      
      // Add instructions for frontend developers
      return {
        ...result,
        instructions: `To upload: Use PUT request to this URL with the file as the body. Set Content-Type header to ${contentType || 'the appropriate MIME type'}.`,
      };
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw new HttpException(
        `Failed to generate presigned URL: ${error.message}`, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: FileUploadDto,
  })
  @ApiOperation({ summary: 'Upload a file (image or video) directly to MinIO' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File uploaded successfully',
    type: FileUploadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file',
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 100 * 1024 * 1024,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    ) 
    file: Express.Multer.File,
    @Body() body: { folder?: string },
  ): Promise<FileUploadResponseDto> {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      // Check if file is an image or video
      if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
        throw new HttpException(
          'Only image and video files are allowed',
          HttpStatus.BAD_REQUEST
        );
      }

      // Determine appropriate folder based on file type
      let folder = 'uploads'; // Default folder
      
      if (body && body.folder) {
        folder = body.folder;
      } else if (file.mimetype.startsWith('image/')) {
        folder = 'images';
      } else if (file.mimetype.startsWith('video/')) {
        folder = 'videos';
      }

      // Upload the file
      const fileUrl = await this.minioService.uploadFile(file, folder);

      this.logger.log(`File uploaded successfully: ${fileUrl}`);
      
      return {
        fileUrl,
        filename: file.originalname,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new HttpException(
        `Failed to upload file: ${error.message}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 