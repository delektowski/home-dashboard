import {ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, PLATFORM_ID} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {isPlatformBrowser} from '@angular/common';
import {DarkModeService} from '../../services/dark-mode.service';
import {ChartColorsEnum} from '../../models/chart-colors.enum';
import {PanelCardComponent} from '../panel-card/panel-card.component';
import {HomeMeasuresLastAggregatedModel} from '../../models/home-measures-last-aggregated.model';

@Component({
  selector: 'app-line-chart',
  imports: [ChartModule, PanelCardComponent],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnChanges {
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  private darkModeService = inject(DarkModeService);

  @Input() axisX: unknown[] | undefined = [];
  @Input() axisY: unknown[] | undefined = [];
  @Input() chartLineColor: ChartColorsEnum = ChartColorsEnum.RED;
  @Input() placeName: string | undefined;
  @Input() placeNameChanged = new Set<string>();
  @Input() measuresLastAggregated?: HomeMeasuresLastAggregatedModel;

  constructor(private cd: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.initChart();
    this.handleDarkMode();
  }

  ngOnChanges() {
    if (this.placeName && this.placeNameChanged.has(this.placeName)) {
      this.initChart();
      this.placeNameChanged.delete(this.placeName);
    }

  }

  handleDarkMode() {
    this.darkModeService.darkModeChanges.subscribe(_ => {
      this.initChart();
    });
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
      const minValue = Math.min(...(this.axisY as number[] || []).filter(val => val !== null && val !== undefined));
      const maxValue = Math.max(...(this.axisY as number[] || []).filter(val => val !== null && val !== undefined));

      const range = maxValue - minValue;
      const buffer = range * 0.2;
      this.data = {
        labels: this.axisX,
        datasets: [
          {
            label: "Temperatura",
            data: this.axisY,
            fill: false,
            borderColor: documentStyle.getPropertyValue(this.chartLineColor),
            tension: 0.4,
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            min: Math.floor(minValue - buffer),
            max: Math.ceil(maxValue + buffer),
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
