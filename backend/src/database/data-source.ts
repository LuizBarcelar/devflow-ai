
import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { join } from 'node:path';

import { Project } from '../modules/projects/entities/project.entity.js';
import { Task } from '../modules/tasks/entities/task.entity.js';
import { User } from '../modules/users/entities/user.entity.js';

import { CreateProjectsTable1760223600000 } from './migrations/1760223600000-CreateProjectsTable.js';
import { CreateTasksTable1760227200000 } from './migrations/1760227200000-CreateTasksTable.js';
import { CreateUsersTable1791849600000 } from './migrations/1791849600000-CreateUsersTable.js';
import { AddProjectOwnership1791936000000 } from './migrations/1791936000000-AddProjectOwnership.js';

export default new DataSource({
  type: 'better-sqlite3',

  database: join(process.cwd(), 'data', 'devflow.db'),

  entities: [
    Project,
    Task,
    User,
  ],

  migrations: [
    CreateProjectsTable1760223600000,
    CreateTasksTable1760227200000,
    CreateUsersTable1791849600000,
    AddProjectOwnership1791936000000,
  ],

  synchronize: false,
  logging: true,
});
