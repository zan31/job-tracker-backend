import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Req,
  UseGuards,
  Inject,
  Delete,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/RequestWithUser';
import { UpdateUserDto } from './dto/update-user.dto';
import { S3 } from 'aws-sdk';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('S3') private s3: S3,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    return this.usersService.findMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/presigned-cv-upload')
  async getPresignedUploadUrl(@Req() req: RequestWithUser) {
    const key = `cv/${req.user.userId}-${Date.now()}.pdf`;

    const params = {
      Bucket: process.env['AWS_BUCKET_NAME'],
      Key: key,
      Expires: 60,
      ContentType: 'application/pdf',
    };

    const uploadUrl = await this.s3.getSignedUrlPromise('putObject', params);
    const fileUrl = `https://${process.env['AWS_BUCKET_NAME']}.s3.${process.env['AWS_REGION']}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req: RequestWithUser) {
    return this.usersService.delete(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
