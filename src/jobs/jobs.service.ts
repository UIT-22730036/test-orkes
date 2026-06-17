import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async createBirthdayJob(): Promise<Job> {
    const users = await this.usersService.findTomorrowBirthdays();
    const emails = users.map((user) => user.email);

    const job = this.jobsRepository.create({
      emails,
      status: 'P',
    });

    return this.jobsRepository.save(job);
  }

  async processPendingJobs(): Promise<void> {
    const pendingJobs = await this.jobsRepository.find({
      where: { status: 'P' },
    });

    this.logger.log(`Found ${pendingJobs.length} pending jobs to process.`);

    for (const job of pendingJobs) {
      this.logger.log(
        `Processing job ID: ${job.id} with ${job.emails.length} emails.`,
      );

      try {
        // Send emails to all listed addresses
        for (const email of job.emails) {
          // Note: Since we only have emails in the Job entity,
          // we use a generic greeting or could look up the user again if names were required.
          await this.mailService.sendWelcomeEmail(email, 'Birthday User');
        }

        // Update status to 'C' (Completed)
        job.status = 'C';
        await this.jobsRepository.save(job);

        this.logger.log(`Successfully completed job ID: ${job.id}`);
      } catch (error) {
        this.logger.error(`Failed to process job ID: ${job.id}`, error.stack);
        // Optionally update to an 'F' (Failed) status or keep as 'P' for retry
      }
    }
  }
}
