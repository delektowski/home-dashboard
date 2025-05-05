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
  placeNames: string[] = [];
  placeNameChanged = new Set<string>();
  protected visible: string = '';


  ngOnInit(): void {
    this.fetchPlaceNamesAndData();
    this.handleVisibilityChange();
    this.refreshOnTimeInterval();
    this.getLatestMeasuresForAllPlaces();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Fetches place names and their corresponding home measures data.
   *
   * This method first retrieves distinct place names, then uses those names to fetch
   * both home measures and current home measures data. The results are processed and
   * stored in the respective class properties.
   */
  fetchPlaceNamesAndData(): void {
    this.homeMeasuresService.setSpinner(true);
    this.homeMeasuresService.getMeasuresPlaceNames().pipe(
      take(1),
      map(result => result.data.getDistinctPlaceNames.placeNames),
      tap(placeNames => {
        this.placeNames = placeNames;
      }),
      switchMap(placeNames => {
        const homeMeasuresObservable = forkJoin(this.getCurrentDayHomeMeasuresByPlaceName());
        const currentHomeMeasuresObservable = forkJoin(this.getCurrentHomeMeasuresByPlaceName());

        return forkJoin({
          homeMeasures: homeMeasuresObservable,
          currentHomeMeasures: currentHomeMeasuresObservable
        });
      })
    ).subscribe({
      next: results => {
        const placeNamesChanged = new Set<string>();
        this.homeMeasuresCharts = results.homeMeasures.map(result => {
          const placeName = result[0]?.placeName;
          if (placeName) {
            placeNamesChanged.add(placeName);
            this.placeNameChanged = placeNamesChanged
          }
          return this.labelsService.handleLabelsValuesSeparation(result);
        });
        console.log('results.currentHomeMeasures',results.currentHomeMeasures)
        results.currentHomeMeasures.filter(result => result !== null).forEach(result => {
          this.currentHomeMeasuresCharts.set(result.placeName, result);
        });
      },
      error: (error) => {
        this.homeMeasuresService.setSpinner(false);
        console.error(error);
      },
      complete: () => {
        this.homeMeasuresService.setSpinner(false)
      }
    });
  }

  /**
   * Fetches home measures data for each place name.
   *
   * @returns {Observable<HomeMeasureModel[]>[]} An array of observables, each fetching the home measures for a specific place name.
   */
  getCurrentDayHomeMeasuresByPlaceName(): Observable<HomeMeasureModel[]>[] {
    return this.placeNames.map((placeName) =>
      this.homeMeasuresService.getMeasuresHome(placeName)
        .pipe(
          take(1),
          map(result => result.data.getMeasuresHome),
        ),
    );
  }

  /**
   * Fetches current home measures data for each place name.
   *
   * @returns {Observable<HomeMeasureModel>[]} An array of observables, each fetching the current home measure for a specific place name.
   */
  getCurrentHomeMeasuresByPlaceName(): Observable<HomeMeasureModel>[] {
    return this.placeNames.map((placeName) => {
        return this.homeMeasuresService.getCurrentHomeMeasure(placeName)
          .pipe(
            take(1),
            map(result => result.data.getCurrentMeasureHome),
          )
      }
    );
  }

  getLatestMeasuresForAllPlaces() {
    this.homeMeasuresService.getLatestMeasuresForAllPlaces().subscribe({
      next: (result) => {
        console.log('Najnowsze pomiary dla wszystkich miejsc:', result.data.getLatestMeasuresForAllPlaces);
      },
      error: (error) => {
        console.error('Błąd podczas pobierania najnowszych pomiarów:', error);
      }
    });
  }

  handleVisibilityChange(): void {
    fromEvent(document, 'visibilitychange').pipe(
      takeUntilDestroyed(this.destroyRef),
      map(() => undefined)
    ).subscribe(() => {
      this.fetchPlaceNamesAndData();
    });
  }

  private refreshOnTimeInterval() {
    this.intervalId = window.setInterval(() => {
      this.fetchPlaceNamesAndData();
    }, 60000);
  }


}
