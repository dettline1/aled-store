import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'admin@aled.local',
  })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'admin123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @ApiProperty({
    description: 'Код двухфакторной аутентификации',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  twoFACode?: string;
}
