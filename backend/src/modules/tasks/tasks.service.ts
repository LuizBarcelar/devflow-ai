
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

  private async ensureProjectExists(id: string): Promise<void> {
    const exists = await this.projectsRepository.existsBy({ id });

    if (!exists) {
      throw new NotFoundException('Projeto não encontrado');
    }
  }

  findAll(projectId?: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: projectId ? { projectId } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    await this.ensureProjectExists(dto.projectId);

    const task = this.tasksRepository.create(dto);

    return this.tasksRepository.save(task);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (dto.projectId !== undefined) {
      await this.ensureProjectExists(dto.projectId);
    }

    Object.assign(task, dto);

    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);

    await this.tasksRepository.remove(task);
  }
}
