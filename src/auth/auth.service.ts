import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    // Если пользователь не найден или пароль не совпадает
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    // Возвращаем null, если валидация не прошла
    return null;
  }

  async login(user: any) {
    if (!user) {
      throw new Error('Invalid user credentials'); // Можно заменить на кастомную ошибку или сообщение
    }
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя в базе данных через UserService
    const newUser = await this.usersService.create({
      username,
      password: hashedPassword,
    });

    // Возвращаем данные пользователя без пароля
    const { password: _, ...result } = newUser;
    return result;
  }
}
