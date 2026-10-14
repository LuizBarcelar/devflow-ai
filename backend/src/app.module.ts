
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { Project } from './modules/projects/entities/project.entity.js';
import { ProjectsModule } from './modules/projects/projects.module.js';

import { Task } from './modules/tasks/entities/task.entity.js';
import { TasksModule } from './modules/tasks/tasks.module.js';

import { User } from './modules/users/entities/user.entity.js';
import { UsersModule } from './modules/users/users.module.js';

import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'data', 'devflow.db'),
      entities: [Project, Task, User],
      synchronize: false,
      logging: true,
    }),

    ProjectsModule,
    TasksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
