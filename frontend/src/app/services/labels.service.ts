import { Injectable } from '@angular/core';
import {HomeMeasureModel} from '../models/home-measure.model';
import {HomeMeasureChartModel} from '../models/home-measure-chart.model';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

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
