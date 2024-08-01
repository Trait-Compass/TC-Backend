import { CloudWatchLogs } from '@aws-sdk/client-cloudwatch-logs';
// import { S3 } from '@aws-sdk/client-s3';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    providers: [
        {
            provide: SecretsManager,
            useValue: new SecretsManager({
                region: 'ap-northeast-2',
            }),
        },
        {
            provide: CloudWatchLogs,
            useValue: new CloudWatchLogs({
                region: 'ap-northeast-2',
            }),
        },
        // {
        //     provide: S3,
        //     useValue: new S3({
        //         region: process.env.AWS_REGION,
        //     }),
        // },
    ],
    exports: [SecretsManager, CloudWatchLogs],
})
export class AwsModule {}
