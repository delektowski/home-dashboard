import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MeasuresHomeDocument = HydratedDocument<MeasuresHomeEntity>;

@Schema()
export class MeasuresHomeEntity {

  @Prop({ required: true })
  placeName: string;

  @Prop({ required: true })
  temperature: number;

  @Prop()
  humidity: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MeasuresHomeSchema = SchemaFactory.createForClass(MeasuresHomeEntity);
