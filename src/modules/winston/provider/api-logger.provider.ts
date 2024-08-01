import { Provider } from '@nestjs/common';
import * as winston from 'winston';
import * as WinstonCloudwatch from 'winston-cloudwatch';
import { isLocal } from 'src/environment';

export const API_LOGGER = 'tcApi';

export const ApiLoggerProvider: Provider = {
    provide: API_LOGGER,
    useFactory: () => {
        return winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
                    return `${timestamp} [${level}]: ${message} ${metaString}`;
                })
            ),
            transports: isLocal
                ? [new winston.transports.Console({})]
                : [
                    new WinstonCloudwatch({
                        logGroupName: 'trait-compass-api',
                        logStreamName: new Date().toISOString().split('T')[0],
                        awsRegion: 'ap-northeast-2',
                        jsonMessage: true,
                    }),
                ],
        });
    },
};
