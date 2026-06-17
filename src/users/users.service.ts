import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findTomorrowBirthdays(): Promise<User[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();

    // PostgreSQL specific query to match month and day regardless of year
    return this.usersRepository.find({
      where: {
        dob: Raw(
          (alias) =>
            `EXTRACT(MONTH FROM ${alias}) = :month AND EXTRACT(DAY FROM ${alias}) = :day`,
          {
            month,
            day,
          },
        ),
      },
    });
  }
}
