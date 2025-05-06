import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
      port: parseInt(this.configService.get<string>('MINIO_PORT')),
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });

    this.bucketName = this.configService.get<string>('MINIO_BUCKET');
    this.initBucket();
  }

  private async initBucket(): Promise<void> {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      // Set bucket policy to allow public read access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );
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
            resolve(0); // Return 0 if we can't get duration
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
    return `http://${endpoint}:${port}/${this.bucketName}/${filename}`;
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
} 