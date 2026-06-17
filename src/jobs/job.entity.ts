import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column('text', { array: true })
  emails!: string[];

  @Column({ length: 50 })
  status!: string;
}
