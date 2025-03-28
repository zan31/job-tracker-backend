import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
  Req,
  ForbiddenException,
  Delete,
  Patch,
} from '@nestjs/common';
import { JobPostsService } from './job-posts.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JobPost } from './entities/job-post.entity';
import { RequestWithUser } from 'src/auth/RequestWithUser';

@Controller('job-posts')
@UseGuards(JwtAuthGuard)
export class JobPostsController {
  constructor(private readonly jobPostsService: JobPostsService) {}

  @Get()
  async findAll(): Promise<JobPost[]> {
    return this.jobPostsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateJobPostDto, @Req() req: RequestWithUser) {
    console.log(req.user);
    if (!req.user.company) {
      throw new ForbiddenException('You must be a recruiter to post jobs.');
    }

    return this.jobPostsService.create(dto, req.user.company);
  }

  @Get('my')
  async getMine(@Req() req: RequestWithUser) {
    if (req.user.company) {
      return this.jobPostsService.findByCompany(req.user.company);
    }
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateJobPostDto) {
    return this.jobPostsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.jobPostsService.delete(id);
  }
}
