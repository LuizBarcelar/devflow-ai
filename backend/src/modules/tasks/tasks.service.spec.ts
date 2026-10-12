
import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Project } from '../projects/entities/project.entity.js';
import { TasksService } from './tasks.service.js';
import {
  Task,
  TaskPriority,
  TaskStatus,
} from './entities/task.entity.js';

describe('TasksService', () => {
  let service: TasksService;

  const projectId = '82cee2bc-f938-448c-b1ec-108fe6e2de1d';
  const taskId = '8fa2bda3-885d-4982-a508-1484d4745155';

  const task: Task = {
    id: taskId,
    title: 'Implementar testes automatizados',
    description: 'Criar testes para o TasksService',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    projectId,
    project: {} as Project,
    createdAt: new Date('2026-10-12T00:00:00.000Z'),
    updatedAt: new Date('2026-10-12T00:00:00.000Z'),
  };

  const tasksRepository = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const projectsRepository = {
    existsBy: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          TasksService,
          {
            provide: getRepositoryToken(Task),
            useValue: tasksRepository,
          },
          {
            provide: getRepositoryToken(Project),
            useValue: projectsRepository,
          },
        ],
      }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findAll', () => {
    it('deve listar todas as tarefas', async () => {
      tasksRepository.find.mockResolvedValue([task]);

      const result = await service.findAll();

      expect(result).toEqual([task]);

      expect(tasksRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
      });
    });

    it('deve filtrar tarefas por projeto', async () => {
      tasksRepository.find.mockResolvedValue([task]);

      const result = await service.findAll(projectId);

      expect(result).toEqual([task]);

      expect(tasksRepository.find).toHaveBeenCalledWith({
        where: { projectId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma tarefa existente', async () => {
      tasksRepository.findOneBy.mockResolvedValue(task);

      const result = await service.findOne(taskId);

      expect(result).toEqual(task);

      expect(tasksRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
    });

    it('deve rejeitar uma tarefa inexistente', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.findOne(taskId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar uma tarefa vinculada a um projeto existente', async () => {
      const dto = {
        title: task.title,
        description: task.description,
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        projectId,
      };

      projectsRepository.existsBy.mockResolvedValue(true);
      tasksRepository.create.mockReturnValue(task);
      tasksRepository.save.mockResolvedValue(task);

      const result = await service.create(dto);

      expect(result).toEqual(task);

      expect(projectsRepository.existsBy).toHaveBeenCalledWith({
        id: projectId,
      });

      expect(tasksRepository.create).toHaveBeenCalledWith(dto);
      expect(tasksRepository.save).toHaveBeenCalledWith(task);
    });

    it('não deve criar uma tarefa com projeto inexistente', async () => {
      projectsRepository.existsBy.mockResolvedValue(false);

      await expect(
        service.create({
          title: 'Nova tarefa',
          projectId,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar o status de uma tarefa', async () => {
      const existingTask = { ...task };

      tasksRepository.findOneBy.mockResolvedValue(existingTask);
      tasksRepository.save.mockImplementation(
        async (value: Task) => value,
      );

      const result = await service.update(taskId, {
        status: TaskStatus.COMPLETED,
      });

      expect(result.status).toBe(TaskStatus.COMPLETED);

      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: taskId,
          status: TaskStatus.COMPLETED,
        }),
      );
    });

    it('deve validar o novo projeto ao alterar o vínculo', async () => {
      const newProjectId =
        'b1e39043-8ca0-4e3c-9562-5f28c00a0001';

      tasksRepository.findOneBy.mockResolvedValue({ ...task });
      projectsRepository.existsBy.mockResolvedValue(false);

      await expect(
        service.update(taskId, {
          projectId: newProjectId,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(projectsRepository.existsBy).toHaveBeenCalledWith({
        id: newProjectId,
      });

      expect(tasksRepository.save).not.toHaveBeenCalled();
    });

    it('deve rejeitar atualização de tarefa inexistente', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(taskId, {
          status: TaskStatus.COMPLETED,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve excluir uma tarefa existente', async () => {
      tasksRepository.findOneBy.mockResolvedValue(task);
      tasksRepository.remove.mockResolvedValue(task);

      await service.remove(taskId);

      expect(tasksRepository.remove).toHaveBeenCalledWith(task);
    });

    it('deve rejeitar exclusão de tarefa inexistente', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.remove(taskId),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.remove).not.toHaveBeenCalled();
    });
  });
});
