import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[] | null> {
    const result = await this.userRepository.find({
      order: {
        id: 'ASC',
      },
    });
    return result.length > 0 ? result : null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async updateToken(userId: number, accessToken: string): Promise<void> {
    await this.userRepository.update(userId, { accessToken });
  }

  // Новый метод для удаления пользователя
  async remove(userId: number): Promise<boolean> {
    const result = await this.userRepository.delete(userId);
    return result.affected > 0;
  }
}
