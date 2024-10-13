import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { User } from './user.entity';
import { UserDto } from './dto/users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Find all users' })
  @ApiResponse({ status: 404, description: 'Users table empty' })
  @Get()
  async findAll(): Promise<User[] | { message: string }> {
    const users = await this.usersService.findAll();

    if (users.length === 0) {
      return { message: 'No users found' };
    }

    // return users.map(({ id, username }) => new UserDto({ id, username }));
    return users;
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'Success delete user' })
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<{ success: boolean }> {
    const success = await this.usersService.remove(id);
    return { success };
  }
}
