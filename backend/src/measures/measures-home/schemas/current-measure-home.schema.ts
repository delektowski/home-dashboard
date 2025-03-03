import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CurrentMeasureDocument = HydratedDocument<CurrentMeasureHomeEntity>;

@Schema()
export class CurrentMeasureHomeEntity {
  @Prop({ required: true })
  placeName: string;

  @Prop({ required: true })
  temperature: number;

  @Prop()
  humidity: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CurrentMeasuresHomeSchema = SchemaFactory.createForClass(
  CurrentMeasureHomeEntity,
);
