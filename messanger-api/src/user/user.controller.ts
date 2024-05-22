import { Body, Controller, Get, HttpCode, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserDto } from './user.dto';

@Controller('user/profile')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Auth()
  async profile(@CurrentUser('id') id: string) {
    return await this.userService.getProfile(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put()
  @Auth()
  async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
    return this.userService.update(id, dto)
  }

  @HttpCode(200)
  @Get('users?')
  @Auth()
  async getUsers(@CurrentUser('id') id: string, @Query('nickname') nickname: string) {
    return this.userService.getUsers(id, nickname)
  }
}
