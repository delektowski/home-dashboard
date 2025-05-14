import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, fromEvent, map, Observable, switchMap, take, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HomeMeasuresService} from '../services/home-measures.service';
import {ChartModule} from 'primeng/chart';
import {LineChartComponent} from './line-chart/line-chart.component';
import {HomeMeasureModel} from '../models/home-measure.model';
import {HomeMeasureChartModel} from '../models/home-measure-chart.model';
import {LabelsService} from '../services/labels.service';
import {MultiLineChartComponent} from './multi-line-chart/multi-line-chart.component';
import {HomeMeasuresAllPlacesModel} from '../models/home-measures-all-places.model';


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule, LineChartComponent, MultiLineChartComponent],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit, OnDestroy {
  private intervalId: number | null = null;
  private destroyRef = inject(DestroyRef);
  private homeMeasuresService = inject(HomeMeasuresService);
  private labelsService = inject(LabelsService);

  homeMeasuresCharts: HomeMeasureChartModel[] = [];
  currentHomeMeasuresCharts = new Map<string, HomeMeasureModel>();
  placeNameChanged = new Set<string>();
  protected visible: string = '';
  ngOnInit(): void {
    this.handleVisibilityChange();
    this.refreshOnTimeInterval();
    this.getMeasuresForAllPlaces();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getMeasuresForAllPlaces() {
    this.homeMeasuresService.setSpinner(true);
    this.homeMeasuresService.getMeasuresForAllPlaces().pipe(take(1), map((result) => result.data.getMeasuresForAllPlaces)).subscribe({
      next: (result) => {
        this.setChartsAndCurrentHomeMeasures(result);

      },

      error: (error) => {
        console.error('getMeasuresForAllPlaces error:', error);
        this.homeMeasuresService.setSpinner(false);
      },
      complete: () => {
        this.homeMeasuresService.setSpinner(false);
      }
    });
  }

  setChartsAndCurrentHomeMeasures(result: HomeMeasuresAllPlacesModel[]) {
    const currentHomeMeasures: HomeMeasureModel[] = []
    const homeMeasures: HomeMeasureModel[][] = []
    const placeNamesChanged = new Set<string>();
    const chartsAndCurrentMeasures = {
      homeMeasures, currentHomeMeasures
    }

    result.forEach((measure) => {
      homeMeasures.push(measure.measures);
      const lastMeasure = measure.measures.at(-1);
      if (lastMeasure) {
        currentHomeMeasures.push(lastMeasure);
      }

    })

    this.homeMeasuresCharts = chartsAndCurrentMeasures.homeMeasures.sort((a, b) => {
      return (a[0]['placeName'] || '').localeCompare(b[0]['placeName'] || '');
    }).map(result => {
      const placeName = result[0]['placeName'];
      if (placeName) {
        placeNamesChanged.add(placeName);
        this.placeNameChanged = placeNamesChanged
      }
      return this.labelsService.handleLabelsValuesSeparation(result);
    });
    chartsAndCurrentMeasures.currentHomeMeasures.filter(result => result !== null).forEach(result => {
      this.currentHomeMeasuresCharts.set(result.placeName, result);
    });
    this.homeMeasuresService.setSpinner(false);
  }

  handleVisibilityChange(): void {
    fromEvent(document, 'visibilitychange').pipe(
      takeUntilDestroyed(this.destroyRef),
      map(() => undefined)
    ).subscribe(() => {
      this.getMeasuresForAllPlaces();
    });
  }

  private refreshOnTimeInterval() {
    this.intervalId = window.setInterval(() => {
      this.getMeasuresForAllPlaces();
    }, 60000);
  }


}
