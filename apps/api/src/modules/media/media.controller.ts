import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto, MediaFiltersDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@aled/shared';
import { User } from '@prisma/client';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Получить URL для загрузки файла' })
  async getPresignedUrl(
    @Body() body: { fileName: string; contentType: string },
    @CurrentUser() user: User,
  ) {
    const result = await this.mediaService.getPresignedUploadUrl(
      body.fileName,
      body.contentType,
      user.id,
    );
    return { data: result };
  }

  @Post()
  @ApiOperation({ summary: 'Зарегистрировать загруженный файл' })
  async create(@Body() createMediaDto: CreateMediaDto, @CurrentUser() user: User) {
    const media = await this.mediaService.createMedia(createMediaDto, user.id);
    return { data: media };
  }

  @Get()
  @ApiOperation({ summary: 'Получить список медиафайлов' })
  async findAll(@Query() filters: MediaFiltersDto, @CurrentUser() user: User) {
    // Обычные пользователи видят только свои файлы
    const userId = [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT].includes(user.role) 
      ? undefined 
      : user.id;

    const result = await this.mediaService.findMany(filters, userId);
    return {
      data: result.media,
      meta: {
        page: result.page,
        limit: filters.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить медиафайл по ID' })
  async findOne(@Param('id') id: string) {
    const media = await this.mediaService.findById(id);
    return { data: media };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить медиафайл' })
  async update(
    @Param('id') id: string,
    @Body() updateData: { alt?: string; tags?: string[] },
  ) {
    const media = await this.mediaService.update(id, updateData);
    return { data: media };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.CONTENT)
  @ApiOperation({ summary: 'Удалить медиафайл' })
  async remove(@Param('id') id: string) {
    const result = await this.mediaService.delete(id);
    return { data: result };
  }
}
