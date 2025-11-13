import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({ description: 'Ключ файла в S3' })
  @IsString()
  fileKey: string;

  @ApiProperty({ description: 'MIME тип файла' })
  @IsString()
  mime: string;

  @ApiProperty({ description: 'Размер файла в байтах' })
  @IsNumber()
  size: number;

  @ApiProperty({ description: 'Ширина изображения', required: false })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty({ description: 'Высота изображения', required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ description: 'Альтернативный текст', required: false })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiProperty({ description: 'Теги', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
