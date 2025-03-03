import { Field, Float, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class MeasuresHomeInput {
  @Field({ description: 'Name of the place where measure device is' })
  placeName: string;

  @Field((type) => Float, {
    description: 'Temperature value',
  })
  @Min(-50)
  @Max(50)
  temperature: number;

  @Field((type) => Float, {
    description: 'Humidity value',
    nullable: true,
  })
  humidity?: number;

}
