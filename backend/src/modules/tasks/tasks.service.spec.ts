
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TasksService } from './tasks.service.js';
import {
  Task,
  TaskPriority,
  TaskStatus,
} from './entities/task.entity.js';
import { Project } from '../projects/entities/project.entity.js';

describe('TasksService', () => {
  let service: TasksService;

  const userId = 'user-1';
  const otherUserId = 'user-2';
  const projectId = 'project-1';
  const taskId = 'task-1';

  const task = {
    id: taskId,
    title: 'Implementar autenticação',
    description: null,
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Task;

  const tasksRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const projectsRepository = {
    existsBy: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new TasksService(
      tasksRepository as unknown as Repository<Task>,
      projectsRepository as unknown as Repository<Project>,
    );
  });

  describe('findAll', () => {
    it('deve listar apenas tarefas do usuário', async () => {
      tasksRepository.find.mockResolvedValue([task]);

      const result = await service.findAll(userId);

      expect(result).toEqual([task]);
      expect(tasksRepository.find).toHaveBeenCalledWith({
        where: {
          project: { userId },
        },
        order: { createdAt: 'DESC' },
      });
    });

    it('deve filtrar tarefas por projeto do usuário', async () => {
      projectsRepository.existsBy.mockResolvedValue(true);
      tasksRepository.find.mockResolvedValue([task]);

      const result = await service.findAll(userId, projectId);

      expect(result).toEqual([task]);

      expect(projectsRepository.existsBy).toHaveBeenCalledWith({
        id: projectId,
        userId,
      });

      expect(tasksRepository.find).toHaveBeenCalledWith({
        where: {
          projectId,
          project: { userId },
        },
        order: { createdAt: 'DESC' },
      });
    });

    it('não deve listar tarefas de projeto de outro usuário', async () => {
      projectsRepository.existsBy.mockResolvedValue(false);

      await expect(
        service.findAll(otherUserId, projectId),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma tarefa do usuário', async () => {
      tasksRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne(taskId, userId);

      expect(result).toEqual(task);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          project: { userId },
        },
      });
    });

    it('deve rejeitar tarefa inexistente ou de outro usuário', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(taskId, otherUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = {
      title: 'Nova tarefa',
      projectId,
    };

    it('deve criar tarefa em projeto do usuário', async () => {
      projectsRepository.existsBy.mockResolvedValue(true);
      tasksRepository.create.mockReturnValue(task);
      tasksRepository.save.mockResolvedValue(task);

      const result = await service.create(dto, userId);

      expect(result).toEqual(task);

      expect(projectsRepository.existsBy).toHaveBeenCalledWith({
        id: projectId,
        userId,
      });

      expect(tasksRepository.save).toHaveBeenCalledWith(task);
    });

    it('não deve criar tarefa em projeto de outro usuário', async () => {
      projectsRepository.existsBy.mockResolvedValue(false);

      await expect(
        service.create(dto, otherUserId),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar uma tarefa do usuário', async () => {
      const updatedTask = {
        ...task,
        status: TaskStatus.COMPLETED,
      };

      tasksRepository.findOne.mockResolvedValue({ ...task });
      tasksRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(
        taskId,
        { status: TaskStatus.COMPLETED },
        userId,
      );

      expect(result.status).toBe(TaskStatus.COMPLETED);
      expect(tasksRepository.save).toHaveBeenCalled();
    });

    it('deve validar o novo projeto ao alterar o vínculo', async () => {
      const newProjectId = 'project-2';

      tasksRepository.findOne.mockResolvedValue({ ...task });
      projectsRepository.existsBy.mockResolvedValue(false);

      await expect(
        service.update(
          taskId,
          { projectId: newProjectId },
          userId,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(projectsRepository.existsBy).toHaveBeenCalledWith({
        id: newProjectId,
        userId,
      });

      expect(tasksRepository.save).not.toHaveBeenCalled();
    });

    it('não deve atualizar tarefa de outro usuário', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(
          taskId,
          { status: TaskStatus.COMPLETED },
          otherUserId,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve excluir uma tarefa do usuário', async () => {
      tasksRepository.findOne.mockResolvedValue(task);
      tasksRepository.remove.mockResolvedValue(task);

      await service.remove(taskId, userId);

      expect(tasksRepository.remove).toHaveBeenCalledWith(task);
    });

    it('não deve excluir tarefa de outro usuário', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove(taskId, otherUserId),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.remove).not.toHaveBeenCalled();
    });
  });
});
