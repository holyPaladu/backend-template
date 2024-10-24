// src/auth/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../../users/dto/users.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Теперь здесь будет объект UserDto
  },
);
