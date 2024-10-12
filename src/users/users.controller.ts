import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Find user by username' })
  @ApiResponse({ status: 200, description: 'Find user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
