
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

import {
  AnalyticsChart,
  type AnalyticsChartOption,
} from '../../../../shared/components/analytics-chart/analytics-chart';

@Component({
  selector: 'app-dashboard-home',
  imports: [AnalyticsChart],
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

  readonly totalTasks = computed(() => this.tasks().length);

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
    const total = this.totalTasks();

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

  readonly statusChartOptions = computed<AnalyticsChartOption>(() => {
    const tasks = this.tasks();

    const todo = tasks.filter(
      task => task.status === 'todo',
    ).length;

    const inProgress = tasks.filter(
      task => task.status === 'in_progress',
    ).length;

    const completed = tasks.filter(
      task => task.status === 'completed',
    ).length;

    return {
      animationDuration: 500,

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },

      grid: {
        left: 12,
        right: 24,
        top: 24,
        bottom: 12,
        containLabel: true,
      },

      xAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#94a3b8',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.12)',
          },
        },
      },

      yAxis: {
        type: 'category',
        data: [
          'A fazer',
          'Em andamento',
          'Concluídas',
        ],
        axisLabel: {
          color: '#cbd5e1',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },

      series: [
        {
          type: 'bar',
          data: [
            {
              value: todo,
              itemStyle: { color: '#64748b' },
            },
            {
              value: inProgress,
              itemStyle: { color: '#6366f1' },
            },
            {
              value: completed,
              itemStyle: { color: '#22c55e' },
            },
          ],
          barWidth: 26,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
          },
          label: {
            show: true,
            position: 'right',
            color: '#cbd5e1',
          },
        },
      ],
    };
  });

  readonly priorityChartOptions = computed<AnalyticsChartOption>(() => {
    const tasks = this.tasks();

    const low = tasks.filter(
      task => task.priority === 'low',
    ).length;

    const medium = tasks.filter(
      task => task.priority === 'medium',
    ).length;

    const high = tasks.filter(
      task => task.priority === 'high',
    ).length;

    return {
      animationDuration: 500,

      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },

      legend: {
        bottom: 0,
        textStyle: {
          color: '#cbd5e1',
        },
      },

      series: [
        {
          type: 'pie',
          radius: ['48%', '72%'],
          center: ['50%', '43%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold',
            },
          },
          data: [
            {
              name: 'Baixa',
              value: low,
              itemStyle: { color: '#22c55e' },
            },
            {
              name: 'Média',
              value: medium,
              itemStyle: { color: '#f59e0b' },
            },
            {
              name: 'Alta',
              value: high,
              itemStyle: { color: '#ef4444' },
            },
          ],
        },
      ],
    };
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
