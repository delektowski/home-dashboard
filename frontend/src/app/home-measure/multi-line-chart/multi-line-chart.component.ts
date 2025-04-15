import {ChangeDetectorRef, Component, effect, inject, Input, OnChanges, OnInit, PLATFORM_ID} from '@angular/core';
import {ChartModule, UIChart} from 'primeng/chart';
import {isPlatformBrowser} from '@angular/common';
import {PanelCardComponent} from '../panel-card/panel-card.component';
import {DarkModeService} from '../../services/dark-mode.service';
import {ChartColorsEnum} from '../../models/chart-colors.enum';

@Component({
  selector: 'app-multi-line-chart',
  imports: [
    UIChart, ChartModule, PanelCardComponent
  ],
  templateUrl: './multi-line-chart.component.html',
  styleUrl: './multi-line-chart.component.scss',
  standalone: true,
})
export class MultiLineChartComponent implements OnInit, OnChanges {
  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);

  private darkModeService = inject(DarkModeService);

  @Input() axisX: unknown[] | undefined = [];
  @Input() axisY: unknown[] | undefined = [];
  @Input() axisYBis: unknown[] | undefined = [];
  @Input() chartLineColorY: ChartColorsEnum = ChartColorsEnum.RED;
  @Input() chartLineColorY1: ChartColorsEnum = ChartColorsEnum.BLUE;
  @Input() placeName: string | undefined;
  @Input() currentTemperature: number | undefined;
  @Input() currentHumidity: number | undefined;
  @Input() createdAt: string | undefined;
  @Input() placeNameChanged = new Set<string>();

  constructor(private cd: ChangeDetectorRef) {}


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
      this.data = {
        labels: this.axisX,
        datasets: [
          {
            label: "Temperatura",
            data: this.axisY,
            fill: false,
            borderColor: documentStyle.getPropertyValue(this.chartLineColorY),
            tension: 0.4,
          },
          {
            label: 'Wilgotność',
            fill: true,
            borderColor: documentStyle.getPropertyValue(this.chartLineColorY1),
            yAxisID: 'y1',
            tension: 0.4,
            backgroundColor: 'rgba(0,0,255, 0.2)',

            data: this.axisYBis
          }
        ]
      };

      this.options = {
        stacked: false,
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
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 0,
            max: 100,
            ticks: {
              color: textColorSecondary
            },
            grid: {
              drawOnChartArea: false,
              color: surfaceBorder
            }
          }
        }
      };
      this.cd.markForCheck();
    }
  }
}
