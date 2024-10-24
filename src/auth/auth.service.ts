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
      throw new Error('Invalid user credentials');
    }

    // Генерация нового accessToken при каждом логине
    const payload = { username: user.username, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Обновляем токен в базе данных
    await this.usersService.updateToken(user.id, newAccessToken);

    // Возвращаем обновлённые данные пользователя с новым accessToken
    const { id: _, accessToken, ...result } = user;

    return { ...result, accessToken: newAccessToken };
  }

  async register(username: string, password: string) {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя в базе данных через UserService
    const newUser = await this.usersService.create({
      username,
      password: hashedPassword,
    });

    // Создаем токен и обновляем пользователя
    const payload = { username: newUser.username, sub: newUser.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.usersService.updateToken(newUser.id, accessToken);

    // Возвращаем данные пользователя без пароля и токена
    const { password: _, accessToken: __, ...result } = newUser;
    return result; // Вернуть результат без пароля и токена
  }
}
