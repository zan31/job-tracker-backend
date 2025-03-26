import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobPostsModule } from './job-posts/job-posts.module';
import { ApplicationsModule } from './applications/applications.module';
import { User } from './users/entities/user.entity';
import { Company } from './companies/entities/company.entity';
import { JobPost } from './job-posts/entities/job-post.entity';
import { Application } from './applications/entities/application.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'zan',
      password: 'skorpijon31',
      database: 'projekt-job-tracker',
      autoLoadEntities: true,
      synchronize: true,
      entities: [User, Company, JobPost, Application],
    }),
    UsersModule,
    CompaniesModule,
    JobPostsModule,
    ApplicationsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
