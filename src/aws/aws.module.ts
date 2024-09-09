import { CloudWatchLogs } from '@aws-sdk/client-cloudwatch-logs';
import { S3 } from '@aws-sdk/client-s3';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import { Global, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Global()
@Module({
    providers: [
        {
            provide: SecretsManager,
            useValue: new SecretsManager({
                region: process.env.AWS_REGION,
            }),
        },
        {
            provide: CloudWatchLogs,
            useValue: new CloudWatchLogs({
                region: process.env.AWS_REGION,
            }),
        },
        {
            provide: S3,
            useValue: new S3({
                region: process.env.AWS_REGION,
            }),
        },
    ],
    exports: [SecretsManager, CloudWatchLogs],
})
export class AwsModule {}
