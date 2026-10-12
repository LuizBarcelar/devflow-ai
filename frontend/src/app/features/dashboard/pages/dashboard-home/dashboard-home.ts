
import { Component, computed, inject, signal } from '@angular/core';
import { Health } from '../../../../core/services/health';
import {
  ProjectsService,
  type Project,
} from '../../../../core/services/projects';

@Component({
  selector: 'app-dashboard-home',
  imports: [],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  private readonly healthService = inject(Health);
  private readonly projectsService = inject(ProjectsService);

  readonly apiStatus = signal('Verificando conexão...');
  readonly apiConnected = signal(false);

  readonly projects = signal<Project[]>([]);
  readonly projectsLoading = signal(true);
  readonly projectsError = signal(false);

  readonly activeProjects = computed(
    () =>
      this.projects().filter(
        (project) => project.status !== 'completed',
      ).length,
  );

  readonly metrics = computed(() => [
    {
      label: 'Projetos ativos',
      value: this.projectsLoading()
        ? '...'
        : this.projectsError()
          ? '—'
          : String(this.activeProjects()).padStart(2, '0'),
      icon: '▣',
    },
    { label: 'Tarefas concluídas', value: '124', icon: '✓' },
    { label: 'Em andamento', value: '16', icon: '◷' },
    { label: 'Produtividade', value: '87%', icon: '↗' },
  ]);

  constructor() {
    this.loadHealth();
    this.loadProjects();
  }

  private loadHealth(): void {
    this.healthService.checkHealth().subscribe({
      next: (response) => {
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
      next: (projects) => {
        this.projects.set(projects);
        this.projectsError.set(false);
        this.projectsLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.projectsError.set(true);
        this.projectsLoading.set(false);
      },
    });
  }
}
