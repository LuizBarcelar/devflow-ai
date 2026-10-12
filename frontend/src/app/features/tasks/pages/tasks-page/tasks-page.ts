
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import {
  TasksService,
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskDto,
} from '../../../../core/services/tasks';
import {
  ProjectsService,
  Project,
} from '../../../../core/services/projects';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage {
  private readonly tasksService = inject(TasksService);
  private readonly projectsService = inject(ProjectsService);

  readonly tasks = signal<Task[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly feedback = signal('');

  readonly filterProject = signal('');
  readonly filterStatus = signal('');
  readonly filterPriority = signal('');

  readonly editingId = signal<string | null>(null);

  form: CreateTaskDto = this.emptyForm();

  readonly filteredTasks = computed(() =>
    this.tasks().filter(task =>
      (!this.filterProject() || task.projectId === this.filterProject()) &&
      (!this.filterStatus() || task.status === this.filterStatus()) &&
      (!this.filterPriority() || task.priority === this.filterPriority())
    )
  );

  readonly completedCount = computed(() =>
    this.tasks().filter(task => task.status === 'completed').length
  );

  readonly inProgressCount = computed(() =>
    this.tasks().filter(task => task.status === 'in_progress').length
  );

  constructor() {
    this.loadData();
  }

  private emptyForm(): CreateTaskDto {
    return {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      projectId: '',
    };
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      tasks: this.tasksService.getAll(),
      projects: this.projectsService.findAll(),
    }).subscribe({
      next: ({ tasks, projects }) => {
        this.tasks.set(tasks);
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os dados.');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (!this.form.title.trim() || !this.form.projectId || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const payload: CreateTaskDto = {
      ...this.form,
      title: this.form.title.trim(),
    };

    const request = this.editingId()
      ? this.tasksService.update(this.editingId()!, payload)
      : this.tasksService.create(payload);

    request.subscribe({
      next: () => {
        this.feedback.set(
          this.editingId() ? 'Tarefa atualizada!' : 'Tarefa criada!'
        );
        this.cancelEdit();
        this.saving.set(false);
        this.loadData();
      },
      error: () => {
        this.error.set('Não foi possível salvar a tarefa.');
        this.saving.set(false);
      },
    });
  }

  edit(task: Task): void {
    this.editingId.set(task.id);

    this.form = {
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
  }

  remove(task: Task): void {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) {
      return;
    }

    this.tasksService.delete(task.id).subscribe({
      next: () => {
        this.feedback.set('Tarefa excluída!');
        this.loadData();
      },
      error: () => this.error.set('Não foi possível excluir a tarefa.'),
    });
  }

  projectName(projectId: string): string {
    return this.projects().find(p => p.id === projectId)?.name ?? 'Projeto';
  }

  statusLabel(status: TaskStatus): string {
    return {
      todo: 'A fazer',
      in_progress: 'Em andamento',
      completed: 'Concluída',
    }[status];
  }

  priorityLabel(priority: TaskPriority): string {
    return {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
    }[priority];
  }
}
