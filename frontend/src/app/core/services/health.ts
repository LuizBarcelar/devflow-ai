
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface HealthResponse {
  status: string;
  service: string;
}

@Injectable({
  providedIn: 'root',
})
export class Health {
  private readonly http = inject(HttpClient);

  checkHealth() {
    return this.http.get<HealthResponse>(
      'http://localhost:8080/api/health'
    );
  }
}
