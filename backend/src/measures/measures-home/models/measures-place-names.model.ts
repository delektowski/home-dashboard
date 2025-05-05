import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class MeasuresPlaceNamesModel {
  @Field(() => [String], { description: 'List of distinct place names', nullable: true })
  placeNames: string[];
}
