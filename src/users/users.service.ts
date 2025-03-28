import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { S3 } from 'aws-sdk';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private readonly companiesService: CompaniesService,
    @Inject('S3') private s3: S3,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({ relations: ['company'] });
  }

  async findMe(userId: number): Promise<User> {
    return await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepo.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);
    if (dto.companyId) {
      user.company = await this.companiesService.findOne(dto.companyId);
    }
    return this.usersRepo.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) throw new NotFoundException();

    if (dto.fullName) user.fullName = dto.fullName;

    if (dto.passwordHash) {
      user.passwordHash = await bcrypt.hash(dto.passwordHash, 10);
    }

    if (dto.cvUrl && user.cvUrl && user.cvUrl !== dto.cvUrl) {
      const oldKey = user.cvUrl.split('.amazonaws.com/')[1];
      await this.s3
        .deleteObject({
          Bucket: process.env['AWS_BUCKET_NAME'],
          Key: oldKey,
        })
        .promise();
    }
    if (dto.cvUrl) user.cvUrl = dto.cvUrl;

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepo.findOne({ where: { email }, relations: ['company'] });
  }
  async delete(id: number): Promise<void> {
    await this.usersRepo.delete(id);
  }
}
