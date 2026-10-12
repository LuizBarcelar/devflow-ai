
import {
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  ProjectsService,
  type Project,
  type ProjectStatus,
  type CreateProjectDto,
} from '../../../../core/services/projects';
import { DatePipe } from '@angular/common';

type ProjectForm = {
  name: string;
  description: string;
  status: ProjectStatus;
};

@Component({
  selector: 'app-projects-page',
  imports: [FormsModule, DatePipe],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly projectsService = inject(ProjectsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly deletingId = signal<string | null>(null);

  readonly error = signal('');
  readonly success = signal('');
  readonly formOpen = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly totalProjects = computed(() => this.projects().length);

  readonly activeProjects = computed(() =>
    this.projects().filter(
      (project) => project.status !== 'completed',
    ).length,
  );

  readonly completedProjects = computed(() =>
    this.projects().filter(
      (project) => project.status === 'completed',
    ).length,
  );

  form: ProjectForm = this.emptyForm();

  constructor() {
    this.loadProjects();
  }

  private emptyForm(): ProjectForm {
    return {
      name: '',
      description: '',
      status: 'planning',
    };
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set('');

    this.projectsService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (projects) => {
          this.projects.set(projects);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar os projetos.');
          this.loading.set(false);
        },
      });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.error.set('');
    this.success.set('');
    this.formOpen.set(true);
  }

  openEdit(project: Project): void {
    this.editingId.set(project.id);

    this.form = {
      name: project.name,
      description: project.description ?? '',
      status: project.status,
    };

    this.error.set('');
    this.success.set('');
    this.formOpen.set(true);
  }

  closeForm(): void {
    if (this.saving()) return;

    this.formOpen.set(false);
    this.editingId.set(null);
  }

  saveProject(): void {
    const name = this.form.name.trim();

    if (!name) {
      this.error.set('Informe o nome do projeto.');
      return;
    }

    if (name.length > 150) {
      this.error.set('O nome deve ter no máximo 150 caracteres.');
      return;
    }

    const payload: CreateProjectDto = {
      name,
      description: this.form.description.trim(),
      status: this.form.status,
    };

    const id = this.editingId();

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    const request = id
      ? this.projectsService.update(id, payload)
      : this.projectsService.create(payload);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.formOpen.set(false);
          this.editingId.set(null);
          this.success.set(
            id
              ? 'Projeto atualizado com sucesso.'
              : 'Projeto criado com sucesso.',
          );
          this.loadProjects();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Não foi possível salvar o projeto.');
        },
      });
  }

  changeStatus(project: Project, status: ProjectStatus): void {
    if (project.status === status) return;

    this.error.set('');
    this.success.set('');

    this.projectsService
      .update(project.id, { status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.success.set('Status atualizado com sucesso.');
          this.loadProjects();
        },
        error: () => {
          this.error.set('Não foi possível atualizar o status.');
        },
      });
  }

  deleteProject(project: Project): void {
    const confirmed = window.confirm(
      `Deseja realmente excluir o projeto "${project.name}"?`,
    );

    if (!confirmed) return;

    this.deletingId.set(project.id);
    this.error.set('');
    this.success.set('');

    this.projectsService
      .remove(project.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingId.set(null);
          this.success.set('Projeto excluído com sucesso.');
          this.loadProjects();
        },
        error: () => {
          this.deletingId.set(null);
          this.error.set('Não foi possível excluir o projeto.');
        },
      });
  }

  statusLabel(status: ProjectStatus): string {
    const labels: Record<ProjectStatus, string> = {
      planning: 'Planejamento',
      in_progress: 'Em andamento',
      completed: 'Concluído',
    };

    return labels[status];
  }
}
