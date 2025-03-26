import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JobPost } from 'src/job-posts/entities/job-post.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: 'applied' })
  status: string;

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => JobPost, (job) => job.id, { onDelete: 'CASCADE' })
  jobPost: JobPost;
}
