import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Текущий пароль',
    example: 'oldpassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  currentPassword: string;

  @ApiProperty({
    description: 'Новый пароль',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  newPassword: string;
}
