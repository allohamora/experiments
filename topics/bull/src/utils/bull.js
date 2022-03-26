import Queue from 'bull';

const { REDIS_PASS, REDIS_HOST, REDIS_PORT } = process.env;

const redis = { host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASS };

export const pingQueue = new Queue('ping', { redis });
