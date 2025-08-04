// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'prajakta',
  database: 'online_learning_platform',
  entities: [User],
  synchronize: true,
});
