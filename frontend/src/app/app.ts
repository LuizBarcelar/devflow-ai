
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Health } from './core/services/health';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly healthService = inject(Health);

  readonly apiStatus = signal('Verificando conexão...');

  constructor() {
    this.healthService.checkHealth().subscribe({
      next: (response) => {
        this.apiStatus.set(
          response.status === 'ok'
            ? 'API Go conectada com sucesso!'
            : 'Status inesperado da API'
        );
      },
      error: () => {
        this.apiStatus.set('Erro ao conectar com a API');
      },
    });
  }
}
