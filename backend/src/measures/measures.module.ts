import { Module } from '@nestjs/common';
import { MeasuresHomeService } from './measures-home/services/measures-home.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeasuresHomeEntity,
  MeasuresHomeSchema,
} from './measures-home/schemas/measures-home.schema';
import { MeasuresHomeResolver } from './measures-home/measures-home.resolver';
import {
  CurrentMeasureHomeEntity,
  CurrentMeasuresHomeSchema,
} from './measures-home/schemas/current-measure-home.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MeasuresHomeEntity.name, schema: MeasuresHomeSchema },
      {name: CurrentMeasureHomeEntity.name, schema: CurrentMeasuresHomeSchema}
    ]),
  ],
  providers: [MeasuresHomeService, MeasuresHomeResolver],
})
export class MeasuresModule {}
