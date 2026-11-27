import 'dotenv/config';
import { DataSource } from 'typeorm';

// Neon: direct (unpooled) connection for migrations
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

// TypeORM CLI config for migrations
export default new DataSource({
  type: 'postgres',
  ...(url
    ? { url, ssl: true }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});
