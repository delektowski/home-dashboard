import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, fromEvent, map, Observable, switchMap, take, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HomeMeasuresService} from '../services/home-measures.service';
import {ChartModule} from 'primeng/chart';
import {LineChartComponent} from './line-chart/line-chart.component';
import {HomeMeasureModel} from '../models/home-measure.model';
import {HomeMeasureChartModel} from '../models/home-measure-chart.model';
import {LabelsService} from '../services/labels.service';


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule, LineChartComponent],
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
  placeNameChanged: string[] = [];
  protected visible: string = '';


  ngOnInit(): void {
    this.fetchPlaceNamesAndData();
    this.subscribeHomeMeasures();
    this.handleVisibilityChange();
    this.refreshOnTimeInterval();
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
        this.homeMeasuresCharts = results.homeMeasures.map(result => {
          return this.labelsService.handleLabelsValuesSeparation(result);
        });

        results.currentHomeMeasures.filter(result => result !== null).forEach(result => {
          this.currentHomeMeasuresCharts.set(result.placeName, result);
        });
      },
      error: (error) => {
        this.homeMeasuresService.setSpinner(false);
        console.error(error);},
      complete: () => {setTimeout(() => this.homeMeasuresService.setSpinner(false), 500)
      }
    });
  }

  /**
   * Fetches home measures data from the service.
   */
  getHomeMeasures(): void {
    forkJoin(this.getCurrentDayHomeMeasuresByPlaceName()).pipe(take(1)).subscribe((homeMeasuresResults) => {
      this.homeMeasuresCharts = homeMeasuresResults.map((result) => {
        return this.labelsService.handleLabelsValuesSeparation(result);
      });
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


  /**
   * Subscribes to home measures updates from the service.
   */
  subscribeHomeMeasures(): void {
    this.homeMeasuresService.subscribeMeasuresHome().pipe(takeUntilDestroyed(this.destroyRef), map((result) => result?.data?.measuresHomeAdded)).subscribe((result) => {
      this.handleCurrentHM(result);
      if (!result?.isForCurrentMeasure && result?.placeName) {
        this.placeNameChanged?.push(result?.placeName);
        this.getHomeMeasures();
      }

    });
  }

  /**
   * Handles the current home measure result.
   *
   * @param {HomeMeasureModel | undefined} result - The home measure result to handle.
   */
  handleCurrentHM(result: HomeMeasureModel | undefined): void {
    if (!result?.placeName) return;

    if (result.isForCurrentMeasure) {
      this.currentHomeMeasuresCharts.set(result.placeName, {
        placeName: result.placeName,
        temperature: result.temperature,
        createdAt: result.createdAt,
      });
    } else if (result.placeName) {
      this.placeNameChanged?.push(result.placeName);
      this.getHomeMeasures();
    }
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
