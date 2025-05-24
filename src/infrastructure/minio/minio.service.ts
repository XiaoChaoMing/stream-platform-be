import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;
  private minioPublicUrl: string;
  private readonly logger = new Logger(MinioService.name);

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
      port: parseInt(this.configService.get<string>('MINIO_PORT')),
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });

    this.bucketName = this.configService.get<string>('MINIO_BUCKET');
    this.minioPublicUrl = this.configService.get<string>('MINIO_PUBLIC_URL');
    this.initBucket();
  }

  private async initBucket(): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Created bucket: ${this.bucketName}`);
        
        // Allow public read access and PUT operations for presigned URLs
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject', 's3:PutObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
        this.logger.log(`Set bucket policy for: ${this.bucketName}`);
      }

      // Set CORS configuration for the bucket - using direct S3 API
      // Note: setBucketCors is not directly available in the Minio JS SDK
      // We'll ensure CORS is configured properly in the MinIO server config
      this.logger.log(`Note: Make sure CORS is properly configured in MinIO server`);
    } catch (error) {
      this.logger.error(`Error initializing bucket: ${error.message}`);
      throw error;
    }
  }

  async getVideoDuration(file: Express.Multer.File): Promise<number> {
    if (!file) {
      return 0;
    }

    // Create a temporary file
    const tempFilePath = path.join(
      os.tmpdir(),
      `temp-video-${Date.now()}-${file.originalname}`,
    );
    
    try {
      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, file.buffer);
      
      // Get duration using ffprobe
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
          // Clean up temp file
          fs.unlinkSync(tempFilePath);
          
          if (err) {
            console.error('Error getting video duration:', err);
            resolve(0); 
          } else {
            const durationInSeconds = Math.floor(metadata.format.duration || 0);
            resolve(durationInSeconds);
          }
        });
      });
    } catch (error) {
      console.error('Error processing video for duration:', error);
      // Try to clean up if possible
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      return 0;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    if (!file) {
      return null;
    }

    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}-${file.originalname}`;

    await this.minioClient.putObject(
      this.bucketName,
      filename,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    // Construct the URL
    const port = this.configService.get<string>('MINIO_PORT');
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
    return `${this.minioPublicUrl}/${this.bucketName}/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      if (pathParts.length >= 3) {
        const objectName = pathParts.slice(2).join('/');
        await this.minioClient.removeObject(this.bucketName, objectName);
      }
    } catch (error) {
      console.error('Error deleting file from MinIO:', error);
      throw error;
    }
  }

  /**
   * Generate a presigned URL for uploading a file
   * @param filename The name of the file to be uploaded
   * @param folder The folder to store the file in
   * @param expiryInSeconds How long the URL will be valid (in seconds)
   * @returns The presigned URL for uploading
   */
  async generatePresignedUrl(
    filename: string,
    folder: string,
    expiryInSeconds = 600, // Default 10 minutes
  ): Promise<string> {
    const timestamp = Date.now();
    const objectName = `${folder}/${timestamp}-${filename}`;
    
    try {
      const url = await this.minioClient.presignedPutObject(
        this.bucketName,
        objectName,
        expiryInSeconds,
      );
      
      this.logger.log(`Generated presigned URL for: ${objectName}`);
      return url;
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate both a presigned URL and the final object name
   * @param filename The name of the file to be uploaded
   * @param folder The folder to store the file in
   * @param expiryInSeconds How long the URL will be valid (in seconds)
   * @param contentType Optional content type for the uploaded file
   * @returns Object containing the presigned URL and final object name
   */
  async generatePresignedUrlWithObjectInfo(
    filename: string,
    folder: string,
    expiryInSeconds = 600, // Default 10 minutes
    contentType?: string,
  ): Promise<{ url: string; objectName: string; fileUrl: string }> {
    const timestamp = Date.now();
    const objectName = `${folder}/${timestamp}-${filename}`;
    
    try {
      // Use the presigned PUT object approach as it's simpler and works well
      const url = await this.minioClient.presignedPutObject(
        this.bucketName,
        objectName,
        expiryInSeconds,
      );
      
      this.logger.log(`Generated presigned PUT URL for: ${objectName}`);
      
      // Calculate the final file URL that will be accessible after upload
      const fileUrl = `${this.minioPublicUrl}/${this.bucketName}/${objectName}`;
      
      return {
        url,
        objectName,
        fileUrl,
      };
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }
} 