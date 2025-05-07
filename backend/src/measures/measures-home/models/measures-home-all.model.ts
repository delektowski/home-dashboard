import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import {MeasuresHomeModel} from "./measures-home.model";

@ObjectType()
export class MeasuresHomeAllModel {


  @Field({ description: 'Name of the place where measure device is' })
  placeName: string;

  @Field(() => [MeasuresHomeModel],{ description: 'List of measures of given place name' })
  measures: MeasuresHomeModel[];




}
