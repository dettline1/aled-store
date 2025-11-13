import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

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
}
