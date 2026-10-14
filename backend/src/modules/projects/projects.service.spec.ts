
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProjectsService } from './projects.service.js';
import {
  Project,
  ProjectStatus,
} from './entities/project.entity.js';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const userId = 'user-1';
  const otherUserId = 'user-2';
  const projectId = 'project-1';

  const project: Project = {
    id: projectId,
    name: 'DevFlow AI',
    description: 'Projeto fullstack com Angular e NestJS',
    status: ProjectStatus.PLANNING,
    userId,
    user: {} as Project['user'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const projectsRepository = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new ProjectsService(
      projectsRepository as unknown as Repository<Project>,
    );
  });

  describe('findAll', () => {
    it('deve listar apenas projetos do usuário autenticado', async () => {
      projectsRepository.find.mockResolvedValue([project]);

      const result = await service.findAll(userId);

      expect(result).toEqual([project]);

      expect(projectsRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    });

    it('deve retornar uma lista vazia quando não houver projetos', async () => {
      projectsRepository.find.mockResolvedValue([]);

      const result = await service.findAll(otherUserId);

      expect(result).toEqual([]);

      expect(projectsRepository.find).toHaveBeenCalledWith({
        where: { userId: otherUserId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um projeto do usuário', async () => {
      projectsRepository.findOneBy.mockResolvedValue(project);

      const result = await service.findOne(projectId, userId);

      expect(result).toEqual(project);

      expect(projectsRepository.findOneBy).toHaveBeenCalledWith({
        id: projectId,
        userId,
      });
    });

    it('não deve permitir consultar projeto de outro usuário', async () => {
      projectsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.findOne(projectId, otherUserId),
      ).rejects.toThrow(NotFoundException);

      expect(projectsRepository.findOneBy).toHaveBeenCalledWith({
        id: projectId,
        userId: otherUserId,
      });
    });
  });

  describe('create', () => {
    it('deve criar projeto associado ao usuário autenticado', async () => {
      const dto = {
        name: 'Novo Projeto',
        description: 'Projeto de teste',
      };

      projectsRepository.create.mockReturnValue(project);
      projectsRepository.save.mockResolvedValue(project);

      const result = await service.create(dto, userId);

      expect(result).toEqual(project);

      expect(projectsRepository.create).toHaveBeenCalledWith({
        ...dto,
        userId,
      });

      expect(projectsRepository.save).toHaveBeenCalledWith(
        project,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar projeto do usuário', async () => {
      const updatedProject = {
        ...project,
        name: 'DevFlow AI Atualizado',
      };

      projectsRepository.findOneBy.mockResolvedValue({
        ...project,
      });

      projectsRepository.save.mockResolvedValue(updatedProject);

      const result = await service.update(
        projectId,
        { name: 'DevFlow AI Atualizado' },
        userId,
      );

      expect(result.name).toBe('DevFlow AI Atualizado');

      expect(projectsRepository.findOneBy).toHaveBeenCalledWith({
        id: projectId,
        userId,
      });

      expect(projectsRepository.save).toHaveBeenCalled();
    });

    it('não deve atualizar projeto de outro usuário', async () => {
      projectsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(
          projectId,
          { name: 'Alteração indevida' },
          otherUserId,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(projectsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve excluir projeto pertencente ao usuário', async () => {
      projectsRepository.findOneBy.mockResolvedValue(project);
      projectsRepository.remove.mockResolvedValue(project);

      await service.remove(projectId, userId);

      expect(projectsRepository.findOneBy).toHaveBeenCalledWith({
        id: projectId,
        userId,
      });

      expect(projectsRepository.remove).toHaveBeenCalledWith(
        project,
      );
    });

    it('não deve excluir projeto de outro usuário', async () => {
      projectsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.remove(projectId, otherUserId),
      ).rejects.toThrow(NotFoundException);

      expect(projectsRepository.remove).not.toHaveBeenCalled();
    });
  });
});
