import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MeasuresHomeModel {
  @Field((type) => ID, { description: 'ID of the measure', name: 'id' })
  _id: string;

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
