
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
}

export type UpdateTaskDto = Partial<CreateTaskDto>;

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/tasks';

  getAll(projectId?: string): Observable<Task[]> {
    const params = projectId
      ? new HttpParams().set('projectId', projectId)
      : undefined;

    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  update(id: string, data: UpdateTaskDto): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
