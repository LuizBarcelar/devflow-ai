
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'node:path';

import { Project } from '../modules/projects/entities/project.entity.js';
import { CreateProjectsTable1760223600000 } from './migrations/1760223600000-CreateProjectsTable.js';

export default new DataSource({
  type: 'better-sqlite3',
  database: join(process.cwd(), 'data', 'devflow.db'),
  entities: [Project],
  migrations: [CreateProjectsTable1760223600000],
  synchronize: false,
  logging: true,
});
