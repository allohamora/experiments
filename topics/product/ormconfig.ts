import { ConnectionOptions } from 'typeorm';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const migrationsDir = path.join(__dirname, 'migrations');

export default {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')],
  migrations: [path.join(migrationsDir, '*{.ts,.js}')],

  synchronize: true,
  cli: {
    migrationsDir,
  },
} as ConnectionOptions;
