import {HomeMeasureModel} from './home-measure.model';


export interface HomeMeasuresLastAggregatedModel extends HomeMeasureModel{
  maxTemperature : number;
  minTemperature: number;
  avgTemperature: number;
  maxHumidity?: number;
  minHumidity?: number;
  avgHumidity?: number;



}
