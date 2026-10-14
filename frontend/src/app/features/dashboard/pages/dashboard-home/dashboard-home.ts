
import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

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

  // API
  readonly apiStatus = signal('Verificando conexão...');
  readonly apiConnected = signal(false);

  // Projetos
  readonly projects = signal<Project[]>([]);
  readonly projectsLoading = signal(true);
  readonly projectsError = signal(false);

  // Tarefas
  readonly tasks = signal<Task[]>([]);
  readonly tasksLoading = signal(true);
  readonly tasksError = signal(false);

  // Filtro por projeto
  readonly selectedProjectId = signal<string>('');

  readonly filteredTasks = computed(() => {
    const projectId = this.selectedProjectId();

    if (!projectId) {
      return this.tasks();
    }

    return this.tasks().filter(
      task => task.projectId === projectId,
    );
  });

  selectProject(projectId: string): void {
    this.selectedProjectId.set(projectId);
  }

  // Indicadores
  readonly activeProjects = computed(() =>
    this.projects().filter(
      project => project.status !== 'completed',
    ).length,
  );

  readonly totalTasks = computed(() =>
    this.filteredTasks().length,
  );

  readonly completedTasks = computed(() =>
    this.filteredTasks().filter(
      task => task.status === 'completed',
    ).length,
  );

  readonly inProgressTasks = computed(() =>
    this.filteredTasks().filter(
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
        caption: 'Total geral de projetos ativos',
      },
      {
        label: 'Tarefas concluídas',
        value: taskValue(this.completedTasks()),
        icon: '✓',
        caption: 'Tarefas concluídas no filtro',
      },
      {
        label: 'Em andamento',
        value: taskValue(this.inProgressTasks()),
        icon: '◷',
        caption: 'Tarefas em andamento no filtro',
      },
      {
        label: 'Taxa de conclusão',
        value: completionValue,
        icon: '↗',
        caption: 'Tarefas concluídas / total filtrado',
      },
    ];
  });

  // Gráfico de tarefas por status
  readonly statusChartOptions = computed<AnalyticsChartOption>(() => {
    const tasks = this.filteredTasks();

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
        right: 36,
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
            formatter: params => {
              const value = Number(params.value ?? 0);

              return value > 0 ? String(value) : '';
            },
          },
        },
      ],
    };
  });

  // Gráfico de tarefas por prioridade
  readonly priorityChartOptions = computed<AnalyticsChartOption>(() => {
    const tasks = this.filteredTasks();

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

      graphic: [
        {
          type: 'group',
          left: 'center',
          top: '43%',
          bounding: 'raw',
          children: [
            {
              type: 'text',
              left: 'center',
              top: -14,
              style: {
                text: String(tasks.length),
                fill: '#f8fafc',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                textVerticalAlign: 'middle',
              },
            },
            {
              type: 'text',
              left: 'center',
              top: 14,
              style: {
                text: 'Tarefas',
                fill: '#94a3b8',
                fontSize: 12,
                textAlign: 'center',
                textVerticalAlign: 'middle',
              },
            },
          ],
        },
      ],

      series: [
        {
          type: 'pie',
          radius: ['52%', '74%'],
          center: ['50%', '43%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            scale: true,
            scaleSize: 6,
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

  // Verificar conexão com a API
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

  // Carregar projetos
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

  // Carregar tarefas
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
