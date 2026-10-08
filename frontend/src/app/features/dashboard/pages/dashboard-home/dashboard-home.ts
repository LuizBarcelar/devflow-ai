
import { Component, inject, signal } from '@angular/core';
import { Health } from '../../../../core/services/health';

@Component({
  selector: 'app-dashboard-home',
  imports: [],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  private readonly healthService = inject(Health);

  readonly apiStatus = signal('Verificando conexão...');
  readonly apiConnected = signal(false);

  readonly metrics = [
    { label: 'Projetos ativos', value: '08', icon: '▣' },
    { label: 'Tarefas concluídas', value: '124', icon: '✓' },
    { label: 'Em andamento', value: '16', icon: '◷' },
    { label: 'Produtividade', value: '87%', icon: '↗' },
  ];

  constructor() {
    this.healthService.checkHealth().subscribe({
      next: (response) => {
        const connected = response.status === 'ok';

        this.apiConnected.set(connected);
        this.apiStatus.set(
          connected ? 'API Go conectada' : 'Resposta inesperada da API'
        );
      },
      error: () => {
        this.apiConnected.set(false);
        this.apiStatus.set('API indisponível');
      },
    });
  }
}
