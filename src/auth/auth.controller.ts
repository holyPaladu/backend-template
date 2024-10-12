import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @Post('login')
  async login(@Body() body) {
    const { username, password } = body;
    // Вызываем validateUser для проверки логина
    const user = await this.authService.validateUser(username, password);
    // Если пользователь не прошел валидацию
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Если пользователь валидный, вызываем login и возвращаем токен
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @Post('register')
  async register(@Body() body) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }
}
