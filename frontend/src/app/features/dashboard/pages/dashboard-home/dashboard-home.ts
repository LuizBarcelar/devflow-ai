
import { Component, computed, inject, signal } from '@angular/core';

import { Health } from '../../../../core/services/health';

import {
  ProjectsService,
  type Project,
} from '../../../../core/services/projects';

import {
  TasksService,
  type Task,
} from '../../../../core/services/tasks';

@Component({
  selector: 'app-dashboard-home',
  imports: [],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  private readonly healthService = inject(Health);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);

  readonly apiStatus = signal('Verificando conexão...');
  readonly apiConnected = signal(false);

  readonly projects = signal<Project[]>([]);
  readonly projectsLoading = signal(true);
  readonly projectsError = signal(false);

  readonly tasks = signal<Task[]>([]);
  readonly tasksLoading = signal(true);
  readonly tasksError = signal(false);

  readonly activeProjects = computed(() =>
    this.projects().filter(
      project => project.status !== 'completed',
    ).length,
  );

  readonly completedTasks = computed(() =>
    this.tasks().filter(
      task => task.status === 'completed',
    ).length,
  );

  readonly inProgressTasks = computed(() =>
    this.tasks().filter(
      task => task.status === 'in_progress',
    ).length,
  );

  readonly completionRate = computed(() => {
    const total = this.tasks().length;

    if (total === 0) {
      return 0;
    }

    return Math.round(
      (this.completedTasks() / total) * 100,
    );
  });

  readonly metrics = computed(() => {
    const projectValue = this.projectsLoading()
      ? '...'
      : this.projectsError()
        ? '—'
        : String(this.activeProjects()).padStart(2, '0');

    const taskValue = (value: number): string => {
      if (this.tasksLoading()) {
        return '...';
      }

      if (this.tasksError()) {
        return '—';
      }

      return String(value).padStart(2, '0');
    };

    const completionValue = this.tasksLoading()
      ? '...'
      : this.tasksError()
        ? '—'
        : `${this.completionRate()}%`;

    return [
      {
        label: 'Projetos ativos',
        value: projectValue,
        icon: '▣',
        caption: 'Dados reais do SQLite',
      },
      {
        label: 'Tarefas concluídas',
        value: taskValue(this.completedTasks()),
        icon: '✓',
        caption: 'Dados reais do SQLite',
      },
      {
        label: 'Em andamento',
        value: taskValue(this.inProgressTasks()),
        icon: '◷',
        caption: 'Dados reais do SQLite',
      },
      {
        label: 'Taxa de conclusão',
        value: completionValue,
        icon: '↗',
        caption: 'Tarefas concluídas / total',
      },
    ];
  });

  constructor() {
    this.loadHealth();
    this.loadProjects();
    this.loadTasks();
  }

  private loadHealth(): void {
    this.healthService.checkHealth().subscribe({
      next: response => {
        const connected = response.status === 'ok';

        this.apiConnected.set(connected);
        this.apiStatus.set(
          connected
            ? 'API NestJS conectada'
            : 'Resposta inesperada da API',
        );
      },
      error: () => {
        this.apiConnected.set(false);
        this.apiStatus.set('API indisponível');
      },
    });
  }

  private loadProjects(): void {
    this.projectsService.findAll().subscribe({
      next: projects => {
        this.projects.set(projects);
        this.projectsError.set(false);
        this.projectsLoading.set(false);
      },
      error: error => {
        console.error('Erro ao carregar projetos:', error);

        this.projectsError.set(true);
        this.projectsLoading.set(false);
      },
    });
  }

  private loadTasks(): void {
    this.tasksService.getAll().subscribe({
      next: tasks => {
        this.tasks.set(tasks);
        this.tasksError.set(false);
        this.tasksLoading.set(false);
      },
      error: error => {
        console.error('Erro ao carregar tarefas:', error);

        this.tasksError.set(true);
        this.tasksLoading.set(false);
      },
    });
  }
}
