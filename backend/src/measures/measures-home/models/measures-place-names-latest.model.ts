import {Field, Float, ObjectType} from '@nestjs/graphql';
import { MeasuresHomeModel } from './measures-home.model';

@ObjectType()
export class MeasuresPlaceNamesLatest {
  @Field({ description: 'Name of the place where measure device is' })
  placeName: string;

  @Field((type) => Float, {
    description: 'Temperature value',
  })
  temperature: number;

  @Field((type) => Float, {
    description: 'Humidity value',
    nullable: true,
  })
  humidity?: number;

  @Field({ description: 'Creation date of the measure' })
  createdAt: Date;
}
