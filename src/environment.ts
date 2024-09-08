import * as dotenv from 'dotenv';
dotenv.config();

export enum Environment {
    MASTER = 'MASTER',
    LOCAL = 'LOCAL',
}

export const environment: Environment =
    process.env.NODE_ENV as Environment;

export const isLocal =
    environment === Environment.LOCAL
