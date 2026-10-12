
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ProjectStatus =
  | 'planning'
  | 'in_progress'
  | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string | null;
  status?: ProjectStatus;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/projects';

  findAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, data);
  }

  update(
    id: string,
    data: UpdateProjectDto,
  ): Observable<Project> {
    return this.http.patch<Project>(
      `${this.apiUrl}/${id}`,
      data,
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
    );
  }
}
