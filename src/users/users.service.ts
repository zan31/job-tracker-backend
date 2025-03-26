import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private readonly companiesService: CompaniesService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepo.findOne({
      where: { id },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);
    if (dto.companyId) {
      user.company = await this.companiesService.findOne(dto.companyId);
    }
    return this.usersRepo.save(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = this.usersRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('Uporabnik ne obstaja');
    }
    await this.usersRepo.update(id, dto);
    return this.usersRepo.findOne({ where: { id: id } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepo.findOne({ where: { email } });
  }
}
