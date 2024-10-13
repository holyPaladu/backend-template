import { IsString, IsEmail, IsInt } from 'class-validator';

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  username: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
