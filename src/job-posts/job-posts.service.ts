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
    return this.jobsRepo.find({ relations: ['company'] });
  }

  async findOne(id: number): Promise<JobPost> {
    return await this.jobsRepo.findOne({
      where: { id },
    });
  }

  async create(dto: CreateJobPostDto, companyId: number): Promise<JobPost> {
    const job = this.jobsRepo.create(dto);
    const company = await this.companiesService.findOne(companyId);
    if (!company) {
      throw new NotFoundException('Podjetje ne obstaja');
    }
    job.company = company;
    return this.jobsRepo.save(job);
  }

  async update(id: number, dto: UpdateJobPostDto): Promise<JobPost> {
    const job = await this.jobsRepo.findOneByOrFail({ id });

    const safeFields = {
      title: dto.title,
      description: dto.description,
      location: dto.location,
      salaryRange: dto.salaryRange,
    };

    await this.jobsRepo.update(id, safeFields);

    return this.jobsRepo.findOne({
      where: { id },
      relations: ['applications', 'company'],
    });
  }

  async findByCompany(companyId: number): Promise<JobPost[]> {
    return this.jobsRepo.find({
      where: { company: { id: companyId } },
      relations: ['applications', 'applications.user'],
    });
  }
  async delete(id: number): Promise<void> {
    await this.jobsRepo.delete(id);
  }
}
