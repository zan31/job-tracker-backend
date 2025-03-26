import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class JobPostsService {
  constructor(
    @InjectRepository(JobPost) private jobsRepo: Repository<JobPost>,
    private readonly companiesService: CompaniesService,
  ) {}

  async findAll(): Promise<JobPost[]> {
    return this.jobsRepo.find();
  }

  async findOne(id: number): Promise<JobPost> {
    return await this.jobsRepo.findOne({
      where: { id },
    });
  }

  async create(dto: CreateJobPostDto): Promise<JobPost> {
    const job = this.jobsRepo.create(dto);
    const company = await this.companiesService.findOne(dto.companyId);
    if (!company) {
      throw new NotFoundException('Podjetje ne obstaja');
    }
    job.company = company;
    return this.jobsRepo.save(job);
  }

  async update(id: number, dto: UpdateJobPostDto): Promise<JobPost> {
    const job = await this.jobsRepo.findOneByOrFail({ id });
    if (dto.companyId) {
      const company = await this.companiesService.findOne(dto.companyId);
      if (!company) {
        throw new NotFoundException('Podjetje ne obstaja');
      }
      job.company = company;
    }
    await this.jobsRepo.update(id, dto);
    return this.jobsRepo.findOne({ where: { id: id } });
  }
}
