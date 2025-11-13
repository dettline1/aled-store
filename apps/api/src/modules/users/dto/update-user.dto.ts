import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '@aled/shared';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Неверный формат email' })
  email?: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '+7 (999) 123-45-67',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: UserRole,
    example: UserRole.CUSTOMER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'Статус пользователя',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    description: 'Аватар пользователя (ключ файла)',
    example: 'avatars/user-123.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
