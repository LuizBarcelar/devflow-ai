import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  private readonly tokenState = signal<string | null>(null);
  private readonly userState = signal<AuthUser | null>(null);

  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(
    () => this.tokenState() !== null && this.userState() !== null,
  );

  get accessToken(): string | null {
    return this.tokenState();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(({ user, accessToken }) => {
          this.userState.set(user);
          this.tokenState.set(accessToken);
        }),
      );
  }

  logout(): void {
    this.tokenState.set(null);
    this.userState.set(null);
  }
}
