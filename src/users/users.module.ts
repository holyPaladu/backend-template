// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entitty'; // Импортируйте User сущность

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Регистрация User сущности
  providers: [UsersService],
  exports: [UsersService], // Экспортируйте, если необходимо использовать в других модулях
})
export class UsersModule {}
