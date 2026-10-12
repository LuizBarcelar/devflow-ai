
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Project } from './modules/projects/entities/project.entity.js';
import { ProjectsModule } from './modules/projects/projects.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'data', 'devflow.db'),
      entities: [Project],
      synchronize: false,
      logging: true,
    }),
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
