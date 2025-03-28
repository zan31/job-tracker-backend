import { Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';

const s3Provider = {
  provide: 'S3',
  useFactory: () => {
    return new AWS.S3({
      region: process.env['AWS_REGION'],
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      },
    });
  },
};

@Module({
  providers: [s3Provider],
  exports: ['S3'],
})
export class AwsModule {}
