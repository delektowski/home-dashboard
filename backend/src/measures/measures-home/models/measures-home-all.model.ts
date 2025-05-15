import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MeasuresHomeModel } from './measures-home.model';

@ObjectType()
export class MeasuresHomeAllModel {
  @Field((type) => Int, {
    description: 'Temperature max value',
  })
  maxTemperature: number;

  @Field((type) => Int, {
    description: 'Temperature min value',
  })
  minTemperature: number;

  @Field((type) => Int, {
    description: 'Temperature average value',
  })
  avgTemperature: number;

  @Field((type) => Int, {
    description: 'Humidity max value',
    nullable: true,
  })
  maxHumidity: number;

  @Field((type) => Int, {
    description: 'Humidity min value',
    nullable: true,
  })
  minHumidity: number;

  @Field((type) => Int, {
    description: 'Humidity average value',
    nullable: true,
  })
  avgHumidity: number;

  @Field(() => [MeasuresHomeModel], {
    description: 'List of measures of given place name',
  })
  measures: MeasuresHomeModel[];
}
