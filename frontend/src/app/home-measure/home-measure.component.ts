import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, map, take} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HomeMeasuresService} from '../services/home-measures.service';
import {ChartModule} from 'primeng/chart';
import {LineChartComponent} from './line-chart/line-chart.component';
import {HomeMeasureModel} from '../models/home-measure.model';
import {HomeMeasureChartModel} from '../models/home-measure-chart.model';
import {LabelsService} from '../services/labels.service';
import {MultiLineChartComponent} from './multi-line-chart/multi-line-chart.component';
import {HomeMeasuresAllPlacesModel} from '../models/home-measures-all-places.model';
import {HomeMeasuresLastAggregatedModel} from '../models/home-measures-last-aggregated.model';
import {ChartsAndCurrentMeasuresModel} from '../models/charts-and-current-measures.model';
import { NoMeasuresComponent } from "./no-measures/no-measures.component";
import { GlobalToggleBtnComponent } from "../global-toggle-btn/global-toggle-btn.component";


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule, LineChartComponent, MultiLineChartComponent, NoMeasuresComponent, GlobalToggleBtnComponent],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit, OnDestroy {
  private intervalId: number | null = null;
  private destroyRef = inject(DestroyRef);
  private homeMeasuresService = inject(HomeMeasuresService);
  private labelsService = inject(LabelsService);
  protected visible: string = '';

  homeMeasuresCharts: HomeMeasureChartModel[] = [];
  measuresLastAggregated = new Map<string, HomeMeasuresLastAggregatedModel>();
  placeNameChanged = new Set<string>();

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
        console.log("result", result)
        this.handleChartsAndCurrentHomeMeasures(result);
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

  handleChartsAndCurrentHomeMeasures(result: HomeMeasuresAllPlacesModel[]) {
    const {homeMeasures, currentHomeMeasures} = this.getChartsAndCurrentMeasures(result);
    this.setHomeMeasuresCharts(homeMeasures)
    this.setCurrentHomeMeasures(currentHomeMeasures)
  }

  getChartsAndCurrentMeasures(result: HomeMeasuresAllPlacesModel[]): ChartsAndCurrentMeasuresModel {
    const homeMeasures: HomeMeasureModel[][] = []
    const currentHomeMeasures: HomeMeasuresLastAggregatedModel[] = []
    const chartsAndCurrentMeasures = {
      homeMeasures, currentHomeMeasures
    }

    result.forEach((measure) => {
      homeMeasures.push(measure.measures);
      currentHomeMeasures.push(this.enrichLastMeasureByAggregations(measure));
    })

    return chartsAndCurrentMeasures
  }

  setHomeMeasuresCharts(homeMeasures: HomeMeasureModel[][]): void {
    const placeNamesChanged = new Set<string>();

    this.homeMeasuresCharts = homeMeasures.sort((a, b) => {
      return (a[0]['placeName'] || '').localeCompare(b[0]['placeName'] || '');
    }).map(result => {
      const placeName = result[0]['placeName'];
      if (placeName) {
        placeNamesChanged.add(placeName);
        this.placeNameChanged = placeNamesChanged
      }
      return this.labelsService.handleLabelsValuesSeparation(result);
    });
  }

  setCurrentHomeMeasures(currentHomeMeasures: HomeMeasuresLastAggregatedModel[]): void {
    currentHomeMeasures.filter(result => result !== null).forEach(result => {
      this.measuresLastAggregated.set(result.placeName, result);
    });
  }

  handleVisibilityChange(): void {
    fromEvent(document, 'visibilitychange').pipe(
      takeUntilDestroyed(this.destroyRef),
      map(() => undefined)
    ).subscribe(() => {
      this.handleAllExpandedOnVisibilityChange();
      this.getMeasuresForAllPlaces();
      
    });
  }

  private refreshOnTimeInterval() {
    this.intervalId = window.setInterval(() => {
      this.getMeasuresForAllPlaces();
    }, 60000);
  }

  private enrichLastMeasureByAggregations(measure: HomeMeasuresAllPlacesModel): HomeMeasuresLastAggregatedModel {
    let lastMeasure = measure.measures.at(-1);
    let enrichedLastMeasure: Record<string, any> = {}
    if (lastMeasure) {
      for (const [key, value] of Object.entries(measure)) {
        if (value !== null && value !== undefined && key !== 'measures') {
          enrichedLastMeasure[key] = value;
        }
      }
    }
    enrichedLastMeasure = {...lastMeasure, ...enrichedLastMeasure};
    return enrichedLastMeasure as HomeMeasuresLastAggregatedModel;
  }

    toggleAllCollapsed() {
    this.homeMeasuresService.isAllCollapsed.set(!this.homeMeasuresService.isAllCollapsed());
  }

  handleAllExpandedOnVisibilityChange() {
    if (!this.homeMeasuresService.anyIsCollapsed){
      this.toggleAllCollapsed() ;
    }
  }
}
