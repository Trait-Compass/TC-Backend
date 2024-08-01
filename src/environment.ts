export enum Environment {
    MASTER = 'MASTER',
    LOCAL = 'LOCAL',
}

export const environment: Environment =
    process.env.ENVIRONMENT as Environment;

export const isLocal =
    environment === Environment.LOCAL
