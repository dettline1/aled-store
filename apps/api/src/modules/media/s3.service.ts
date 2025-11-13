import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get('S3_ENDPOINT'),
      region: this.configService.get('S3_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
      forcePathStyle: this.configService.get('S3_FORCE_PATH_STYLE', 'true') === 'true',
    });

    this.bucketName = this.configService.get('S3_BUCKET', 'aled-media');
  }

  async getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 час
  }

  async getPresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 час
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  getPublicUrl(key: string): string {
    const publicUrl = this.configService.get('S3_PUBLIC_URL');
    return `${publicUrl}/${key}`;
  }

  generateFileKey(folder: string, originalName: string, userId?: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const prefix = userId ? `${folder}/${userId}` : folder;
    return `${prefix}/${timestamp}_${randomSuffix}_${cleanName}`;
  }
}
