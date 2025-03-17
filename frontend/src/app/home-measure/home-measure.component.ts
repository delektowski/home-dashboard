import {Component, inject, OnInit} from '@angular/core';
import {forkJoin, map, Observable, switchMap, take, tap} from 'rxjs';
import {HomeMeasuresService} from '../services/home-measures.service';
import {ChartModule} from 'primeng/chart';
import {LineChartComponent} from './line-chart/line-chart.component';
import {HomeMeasureModel} from '../models/home-measure.model';
import {HomeMeasureChartModel} from '../models/home-measure-chart.model';


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule, LineChartComponent],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit {
  private homeMeasuresService = inject(HomeMeasuresService);
  homeMeasuresCharts: HomeMeasureChartModel[] = [];
  currentHomeMeasuresCharts = new Map<string, HomeMeasureModel>();
  placeNames: string[] = [];
  placeNameChanged: string[] = [];

  ngOnInit(): void {
    this.fetchPlaceNamesAndData();
    this.subscribeHomeMeasures();
  }

  fetchPlaceNamesAndData(): void {
    this.homeMeasuresService.getMeasuresPlaceNames().pipe(
      take(1),
      map(result => result.data.getDistinctPlaceNames.placeNames),
      tap(placeNames => {
        this.placeNames = placeNames;
      }),
      switchMap(placeNames => {
        const homeMeasuresObservable = forkJoin(this.getHomeMeasuresByPlaceName());
        const currentHomeMeasuresObservable = forkJoin(this.getCurrentHomeMeasuresByPlaceName());

        return forkJoin({
          homeMeasures: homeMeasuresObservable,
          currentHomeMeasures: currentHomeMeasuresObservable
        });
      })
    ).subscribe(results => {
      this.homeMeasuresCharts = results.homeMeasures.map(result => {
        return this.handleLabelsValuesSeparation(result);
      });


      results.currentHomeMeasures.filter(result => result !== null).forEach(result => {
        this.currentHomeMeasuresCharts.set(result.placeName, result);
      });

    });
  }

  /**
   * Fetches home measures data from the service.
   */
  getHomeMeasures(): void {
    forkJoin(this.getHomeMeasuresByPlaceName()).pipe(take(1)).subscribe((homeMeasuresResults) => {
      this.homeMeasuresCharts = homeMeasuresResults.map((result) => {
        return this.handleLabelsValuesSeparation(result);
      });
    });
  }

  /**
   * Fetches home measures data for each place name.
   *
   * @returns {Observable<HomeMeasureModel[]>[]} An array of observables, each fetching the home measures for a specific place name.
   */
  getHomeMeasuresByPlaceName(): Observable<HomeMeasureModel[]>[] {
    return this.placeNames.map((placeName) =>
      this.homeMeasuresService.getHomeMeasures(placeName)
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
        console.log("placeName43", placeName)
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
    this.homeMeasuresService.subscribeMeasuresHome().pipe(map((result) => result?.data?.measuresHomeAdded)).subscribe((result) => {
      this.handleCurrentHM(result);
      if (!result?.isForCurrentMeasure && result?.placeName) {
        this.placeNameChanged?.push(result?.placeName);
        this.getHomeMeasures();
      }

    });
  }

  handleCurrentHM(result: HomeMeasureModel | undefined): void {
    if (!result?.placeName) return;

    if (result.isForCurrentMeasure) {
      // Simply update or add to the Map
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

  /**
   * Separates labels and values from the home measure results.
   *
   * @param {HomeMeasureModel[]} result - The array of home measure results.
   * @returns {HomeMeasureChartModel} The home measure chart model with separated labels and values.
   */
  handleLabelsValuesSeparation(result: HomeMeasureModel[]): HomeMeasureChartModel {
    return result.reduce((acc: HomeMeasureChartModel, current) => {
      if (!acc.placeName) {
        acc.placeName = current.placeName;
      }
      acc.labels.push(this.splitLabelTwoLines(current.createdAt));
      acc.values.push(current.temperature);
      return acc;
    }, {labels: [], values: [], placeName: ''});
  }

  /**
   * Splits the given date string into two lines: time and date.
   *
   * @param {string} createdAt - The date string to be split.
   * @returns {string[]} An array containing the time and date as separate strings.
   */
  splitLabelTwoLines(createdAt: string): string[] {
    const date = new Date(createdAt);
    const hoursMinutes = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const dayMonth = date.toLocaleDateString([], {day: '2-digit', month: '2-digit'});
    return [hoursMinutes, dayMonth];
  }
}
