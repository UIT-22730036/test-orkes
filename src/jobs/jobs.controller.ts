import { Controller, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('birthday')
  async createBirthdayJob(): Promise<Job> {
    return this.jobsService.createBirthdayJob();
  }

  @Post('process-pending')
  async processPendingJobs(): Promise<{ message: string }> {
    await this.jobsService.processPendingJobs();
    return { message: 'Pending jobs processing started/completed' };
  }
}
