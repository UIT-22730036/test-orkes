import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('birthday-tomorrow')
  async getTomorrowBirthdays(): Promise<User[]> {
    return this.usersService.findTomorrowBirthdays();
  }
}
