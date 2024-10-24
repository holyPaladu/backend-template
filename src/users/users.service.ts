import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<UserEntity[] | null> {
    const result = await this.userRepository.find({
      order: {
        id: 'ASC',
      },
    });
    return result.length > 0 ? result : null;
  }
  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async updateToken(userId: number, accessToken: string): Promise<void> {
    await this.userRepository.update(userId, { accessToken });
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.findOneById(id);

    if (!user) {
      return false; // Возвращаем false, если пользователь не найден
    }

    // Логика удаления пользователя
    await this.userRepository.delete(id);

    return true; // Возвращаем true, если удаление успешно
  }

  async findOneById(id: number) {
    // Логика поиска пользователя по ID
    return this.userRepository.findOne({ where: { id } });
  }
}
