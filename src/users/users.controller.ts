import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Find all users' })
  @ApiResponse({ status: 404, description: 'Users table empty' })
  @Get()
  async findAll(): Promise<UserDto[] | { message: string }> {
    const users = await this.usersService.findAll();

    if (users.length === 0) {
      return { message: 'No users found' };
    }

    return users.map(({ id, username }) => new UserDto({ id, username }));
    // return users;
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'Success delete user' })
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<{ success: boolean }> {
    const success = await this.usersService.remove(id);
    // Если метод remove вернет false (или null), выбрасываем исключение
    if (!success) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success };
  }

  @ApiOperation({ summary: 'Protected data with JWT token' })
  @ApiResponse({ status: 200, description: 'Correct validate JWT token' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('protected')
  getProtectedData(@User() user: UserDto) {
    return user;
  }
}
