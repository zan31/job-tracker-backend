import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepo: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companiesRepo.find();
  }

  async findOne(id: number): Promise<Company> {
    return await this.companiesRepo.findOne({
      where: { id },
    });
  }

  create(dto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepo.create(dto);
    return this.companiesRepo.save(company);
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.companiesRepo.findOneByOrFail({ id });
    Object.assign(company, dto);
    return this.companiesRepo.save(company);
  }
}
