import {HomeMeasureModel} from './home-measure.model';
import {HomeMeasuresLastAggregatedModel} from './home-measures-last-aggregated.model';

export interface ChartsAndCurrentMeasuresModel {
  homeMeasures: HomeMeasureModel[][];
  currentHomeMeasures: HomeMeasuresLastAggregatedModel[]
}
