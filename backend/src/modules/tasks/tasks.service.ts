
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../projects/entities/project.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  private async ensureProjectOwned(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const exists = await this.projectsRepository.existsBy({
      id: projectId,
      userId,
    });

    if (!exists) {
      throw new NotFoundException('Projeto não encontrado');
    }
  }

  async findAll(
    userId: string,
    projectId?: string,
  ): Promise<Task[]> {
    if (projectId) {
      await this.ensureProjectOwned(projectId, userId);
    }

    return this.tasksRepository.find({
      where: {
        ...(projectId ? { projectId } : {}),
        project: { userId },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: {
        id,
        project: { userId },
      },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async create(
    dto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    await this.ensureProjectOwned(dto.projectId, userId);

    const task = this.tasksRepository.create(dto);

    return this.tasksRepository.save(task);
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);

    if (dto.projectId !== undefined) {
      await this.ensureProjectOwned(dto.projectId, userId);
    }

    Object.assign(task, dto);

    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);

    await this.tasksRepository.remove(task);
  }
}
