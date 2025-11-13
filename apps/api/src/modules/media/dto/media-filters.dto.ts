import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MediaFiltersDto {
  @ApiProperty({ description: 'Номер страницы', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Количество элементов на странице', required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({ description: 'MIME тип для фильтрации', required: false })
  @IsOptional()
  @IsString()
  mime?: string;

  @ApiProperty({ description: 'Теги для фильтрации', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Поисковый запрос', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
