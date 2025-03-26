import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UsersService } from 'src/users/users.service';
import { JobPostsService } from 'src/job-posts/job-posts.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private appsRepo: Repository<Application>,
    private readonly usersService: UsersService,
    private readonly jobPostsService: JobPostsService,
  ) {}

  async create(dto: CreateApplicationDto): Promise<Application> {
    const app = this.appsRepo.create({ status: dto.status ?? 'applied' });
    const user = this.usersService.findOne(dto.userId);
    const jobPost = this.jobPostsService.findOne(dto.jobPostId);
    if (!user || !jobPost) {
      throw new NotFoundException('Uporabnik ali razpis ne obstaja');
    }
    return this.appsRepo.save(app);
  }

  async update(id: number, dto: UpdateApplicationDto): Promise<Application> {
    const app = await this.appsRepo.findOneByOrFail({ id });
    if (dto.userId) {
      const user = await this.usersService.findOne(dto.userId);
      if (!user) {
        throw new NotFoundException('Uporabnik ne obstaja');
      }
      app.user = user;
    }
    if (dto.jobPostId) {
      const jobPost = await this.jobPostsService.findOne(dto.jobPostId);
      if (!jobPost) {
        throw new NotFoundException('Razpis ne obstaja');
      }
      app.jobPost = jobPost;
    }
    Object.assign(app, dto);
    return this.appsRepo.save(app);
  }
}
