import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user123' }) // Добавляем метаданные для Swagger
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user123' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
