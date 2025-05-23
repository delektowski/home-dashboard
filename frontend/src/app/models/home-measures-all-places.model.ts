import {HomeMeasureModel} from './home-measure.model';


export interface HomeMeasuresAllPlacesModel {
  maxTemperature : number;
  minTemperature: number;
  avgTemperature: number;
  maxHumidity?: number;
  minHumidity?: number;
  avgHumidity?: number;
  measures: HomeMeasureModel[];


}
