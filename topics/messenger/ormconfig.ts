import { ConnectionOptions } from 'typeorm';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const srcDir = path.join(__dirname, 'src');
const databaseDir = path.join(srcDir, 'database');
const migrationsDir = path.join(databaseDir, 'migrations');

console.log(srcDir, databaseDir, migrationsDir);

export default {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')],
  migrations: [path.join(migrationsDir, '*{.ts,.js}')],

  logging: true,
  synchronize: true,

  cli: {
    migrationsDir,
  },
} as ConnectionOptions;
