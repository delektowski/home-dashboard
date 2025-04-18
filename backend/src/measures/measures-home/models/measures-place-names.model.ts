import { Field, ObjectType } from '@nestjs/graphql';
import { MeasuresHomeModel } from './measures-home.model';

@ObjectType()
export class MeasuresPlaceNamesModel {
  @Field(() => [MeasuresHomeModel], { nullable: true })
  placeNames: MeasuresHomeModel[];
}
