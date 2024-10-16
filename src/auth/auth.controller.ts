import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  async register(@Body() regsiterDto: RegisterDto) {
    const { username, password } = regsiterDto;
    return this.authService.register(username, password);
  }
}
