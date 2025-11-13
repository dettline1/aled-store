import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

import { PrismaService } from '../database/prisma.service';
import { S3Service } from './s3.service';
import { CreateMediaDto, MediaFiltersDto } from './dto';

@Injectable()
export class MediaService {
  private allowedMimeTypes: string[];
  private maxFileSize: number;

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    private configService: ConfigService,
  ) {
    this.allowedMimeTypes = this.configService.get('ALLOWED_FILE_TYPES', '').split(',');
    this.maxFileSize = parseInt(this.configService.get('MAX_FILE_SIZE', '10485760')); // 10MB
  }

  async getPresignedUploadUrl(fileName: string, contentType: string, userId: string) {
    // Валидация типа файла
    if (!this.allowedMimeTypes.includes(contentType)) {
      throw new BadRequestException('Недопустимый тип файла');
    }

    const fileKey = this.s3Service.generateFileKey('uploads', fileName, userId);
    const uploadUrl = await this.s3Service.getPresignedUploadUrl(fileKey, contentType);

    return {
      uploadUrl,
      fileKey,
      publicUrl: this.s3Service.getPublicUrl(fileKey),
    };
  }

  async createMedia(createMediaDto: CreateMediaDto, userId: string) {
    // Валидация размера файла
    if (createMediaDto.size > this.maxFileSize) {
      throw new BadRequestException('Файл слишком большой');
    }

    const media = await this.prisma.media.create({
      data: {
        ...createMediaDto,
        createdBy: userId,
      },
    });

    return media;
  }

  async findMany(filters: MediaFiltersDto, userId?: string) {
    const { page = 1, limit = 20, mime, tags, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (mime) {
      where.mime = { contains: mime };
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (search) {
      where.OR = [
        { fileKey: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Обычные пользователи видят только свои файлы
    if (userId) {
      where.createdBy = userId;
    }

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    // Добавляем публичные URL
    const mediaWithUrls = media.map(item => ({
      ...item,
      publicUrl: this.s3Service.getPublicUrl(item.fileKey),
    }));

    return {
      media: mediaWithUrls,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Медиафайл не найден');
    }

    return {
      ...media,
      publicUrl: this.s3Service.getPublicUrl(media.fileKey),
      downloadUrl: await this.s3Service.getPresignedDownloadUrl(media.fileKey),
    };
  }

  async update(id: string, updateData: { alt?: string; tags?: string[] }) {
    const media = await this.prisma.media.update({
      where: { id },
      data: updateData,
    });

    return {
      ...media,
      publicUrl: this.s3Service.getPublicUrl(media.fileKey),
    };
  }

  async delete(id: string) {
    const media = await this.findById(id);

    // Удаляем файл из S3
    await this.s3Service.deleteFile(media.fileKey);

    // Удаляем запись из БД
    await this.prisma.media.delete({
      where: { id },
    });

    return { message: 'Медиафайл успешно удален' };
  }

  async generateThumbnails(originalKey: string, buffer: Buffer) {
    const thumbnails = [];
    const sizes = [
      { name: 'small', width: 150, height: 150 },
      { name: 'medium', width: 300, height: 300 },
      { name: 'large', width: 800, height: 800 },
    ];

    for (const size of sizes) {
      const thumbnailBuffer = await sharp(buffer)
        .resize(size.width, size.height, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

      const thumbnailKey = originalKey.replace(/\.[^/.]+$/, `_${size.name}.webp`);
      
      // Здесь можно загрузить миниатюру в S3
      // const uploadUrl = await this.s3Service.getPresignedUploadUrl(thumbnailKey, 'image/webp');
      
      thumbnails.push({
        size: size.name,
        key: thumbnailKey,
        url: this.s3Service.getPublicUrl(thumbnailKey),
      });
    }

    return thumbnails;
  }
}
