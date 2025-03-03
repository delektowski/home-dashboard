import { Component, inject, OnInit } from '@angular/core';
import { forkJoin, map, Observable, take } from 'rxjs';
import { HomeMeasuresService } from '../services/home-measures.service';
import { ChartModule } from 'primeng/chart';
import { LineChartComponent } from './line-chart/line-chart.component';
import { HomeMeasureModel } from '../models/home-measure.model';
import { HomeMeasureChartModel } from '../models/home-measure-chart.model';
import { PlaceNameEnum } from '../models/place-name.enum';


@Component({
  selector: 'app-home-measure',
  imports: [ChartModule, LineChartComponent],
  templateUrl: './home-measure.component.html',
  styleUrl: './home-measure.component.scss',
})
export class HomeMeasureComponent implements OnInit {
  private homeMeasuresService = inject(HomeMeasuresService);
  homeMeasuresCharts: HomeMeasureChartModel[] = [];
  currentHomeMeasuresCharts: HomeMeasureModel[] = [];
  placeNames = [PlaceNameEnum.TEST1];
  placeNameChanged: string[] = [];

  ngOnInit(): void {
    console.log('KOZAAA');
    this.getHomeMeasures();
    this.getCurrentHomeMeasures();
    this.subscribeHomeMeasures();
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
   * Fetches current home measures data from the service.
   */
  getCurrentHomeMeasures(): void {
    forkJoin(this.getCurrentHomeMeasuresByPlaceName()).pipe(take(1)).subscribe((currentMeasuresResults) => {
      this.currentHomeMeasuresCharts = currentMeasuresResults;
    });
  }


  /**
   * Fetches current home measures data for each place name.
   *
   * @returns {Observable<HomeMeasureModel>[]} An array of observables, each fetching the current home measure for a specific place name.
   */
  getCurrentHomeMeasuresByPlaceName(): Observable<HomeMeasureModel>[] {
    return this.placeNames.map((placeName) =>
      this.homeMeasuresService.getCurrentHomeMeasure(placeName)
        .pipe(
          take(1),
          map(result => result.data.getCurrentMeasureHome),
        ),
    );
  }

  /**
   * Subscribes to home measures updates from the service.
   */
  subscribeHomeMeasures(): void {
    this.homeMeasuresService.subscribeMeasuresHome().pipe(map((result) => result?.data?.measuresHomeAdded)).subscribe((result) => {
      this.updateCurrentHM(result);
      if(!result?.isForCurrentMeasure && result?.placeName) {
        this.placeNameChanged?.push(result?.placeName);
        this.updateHMCharts()
      }

    });
  }

  updateCurrentHM(result: HomeMeasureModel | undefined): void {
    if (result?.placeName) {
      let placeNameMeasureToChangeIndex = this.currentHomeMeasuresCharts.findIndex(measure => measure.placeName === result.placeName);

      if (placeNameMeasureToChangeIndex !== -1 && result?.temperature) {
        this.currentHomeMeasuresCharts[placeNameMeasureToChangeIndex] = {
          ...this.currentHomeMeasuresCharts[placeNameMeasureToChangeIndex],
          temperature: result.temperature,
          createdAt: result.createdAt,
        };
      }
    }
  }

  updateHMCharts(): void {
    this.getHomeMeasures();

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
    }, { labels: [], values: [], placeName: '' });
  }

  /**
   * Splits the given date string into two lines: time and date.
   *
   * @param {string} createdAt - The date string to be split.
   * @returns {string[]} An array containing the time and date as separate strings.
   */
  splitLabelTwoLines(createdAt: string): string[] {
    const date = new Date(createdAt);
    const hoursMinutes = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayMonth = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    return [hoursMinutes, dayMonth];
  }
}
