import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
  Req,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/RequestWithUser';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('my')
  getMyApplications(@Req() req: RequestWithUser) {
    return this.applicationsService.findByUser(req.user.userId);
  }

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateApplicationDto) {
    const userId = req.user.userId;
    if (req.user.company) {
      throw new ForbiddenException(
        "You can't be a recruiter and apply for jobs at the same time!",
      );
    }
    return this.applicationsService.create(dto, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, dto);
  }

  @Get('job/:jobId')
  getByJob(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.applicationsService.findByJob(jobId);
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { status: string },
  ) {
    return this.applicationsService.updateStatus(id, dto.status);
  }
}
