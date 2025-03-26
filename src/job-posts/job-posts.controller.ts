import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { JobPostsService } from './job-posts.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JobPost } from './entities/job-post.entity';

@Controller('job-posts')
@UseGuards(JwtAuthGuard)
export class JobPostsController {
  constructor(private readonly jobPostsService: JobPostsService) {}

  @Get()
  async findAll(): Promise<JobPost[]> {
    return this.jobPostsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateJobPostDto) {
    return this.jobPostsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateJobPostDto) {
    return this.jobPostsService.update(id, dto);
  }
}
