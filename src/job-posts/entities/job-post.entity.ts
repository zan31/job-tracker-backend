import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';

@Entity('job_posts')
export class JobPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ name: 'salary_range', length: 100, nullable: true })
  salaryRange: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'posted_at' })
  postedAt: Date;

  @ManyToOne(() => Company, (company) => company.jobPosts, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  company: Company;
}
