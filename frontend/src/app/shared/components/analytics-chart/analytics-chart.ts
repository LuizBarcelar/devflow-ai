
import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';

import * as echarts from 'echarts/core';

import {
  BarChart,
  PieChart,
} from 'echarts/charts';

import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

import type { ComposeOption } from 'echarts/core';

import type {
  BarSeriesOption,
  PieSeriesOption,
} from 'echarts/charts';

import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';

// Registra somente os recursos necessários do ECharts.
echarts.use([
  BarChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

// Define os tipos aceitos pelos gráficos.
export type AnalyticsChartOption = ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
>;

@Component({
  selector: 'app-analytics-chart',
  standalone: true,

  template: `
    <div
      #chartContainer
      class="chart-container"
      role="img"
      [attr.aria-label]="description()"
    ></div>
  `,

  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .chart-container {
      width: 100%;
      height: 300px;
      min-width: 0;
    }

    @media (max-width: 600px) {
      .chart-container {
        height: 260px;
      }
    }
  `],
})
export class AnalyticsChart implements OnDestroy {
  // Configurações recebidas do componente pai.
  readonly options = input.required<AnalyticsChartOption>();

  // Descrição acessível do gráfico.
  readonly description = input(
    'Gráfico de análise de tarefas',
  );

  // Referência ao elemento HTML do gráfico.
  private readonly chartContainer =
    viewChild.required<ElementRef<HTMLDivElement>>(
      'chartContainer',
    );

  private readonly host = inject(ElementRef);

  private chart?: echarts.ECharts;

  private resizeObserver?: ResizeObserver;

  constructor() {
    // Inicializa o gráfico após a renderização do Angular.
    afterNextRender(() => {
      const element = this.chartContainer().nativeElement;

      this.chart = echarts.init(element);

      this.chart.setOption(this.options(), true);

      // Ajusta o gráfico quando o container muda de tamanho.
      this.resizeObserver = new ResizeObserver(() => {
        this.chart?.resize();
      });

      this.resizeObserver.observe(
        this.host.nativeElement,
      );
    });

    // Atualiza o gráfico quando as opções mudam.
    effect(() => {
      const options = this.options();

      this.chart?.setOption(options, true);
    });
  }

  ngOnDestroy(): void {
    // Libera os recursos ao destruir o componente.
    this.resizeObserver?.disconnect();
    this.chart?.dispose();
  }
}
