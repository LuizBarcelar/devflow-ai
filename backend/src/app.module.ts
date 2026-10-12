
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Project } from './modules/projects/entities/project.entity.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { Task } from './modules/tasks/entities/task.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'data', 'devflow.db'),
      entities: [Project, Task],
      synchronize: false,
      logging: true,
    }),
    ProjectsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
