import { Injectable } from '@nestjs/common';
import { MeasuresHomeDto } from '../dto/measures-home.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeasuresHomeEntity } from '../schemas/measures-home.schema';
import { CurrentMeasureHomeEntity } from '../schemas/current-measure-home.schema';

@Injectable()
export class MeasuresHomeService {
  constructor(
    @InjectModel(MeasuresHomeEntity.name)
    private measuresHomeModel: Model<MeasuresHomeEntity>,
    @InjectModel(CurrentMeasureHomeEntity.name)
    private currentMeasureHomeModel: Model<CurrentMeasureHomeEntity>,
  ) {}

  async createMeasuresHome(
    measuresHomeDto: MeasuresHomeDto,
  ): Promise<MeasuresHomeEntity> {
    const createMeasuresHome = new this.measuresHomeModel(measuresHomeDto);
    return createMeasuresHome.save();
  }

  async getMeasuresHome(
    placeName: string,
  ): Promise<MeasuresHomeEntity[] | null> {
    return this.measuresHomeModel.find({ placeName }).exec();
  }

  async getDistinctPlaceNames(): Promise<string[]> {
    return this.measuresHomeModel.distinct('placeName').exec();
  }

  async getCurrentMeasureHome(
    placeName: string,
  ): Promise<CurrentMeasureHomeEntity | null> {
    return this.currentMeasureHomeModel.findOne({ placeName }).exec();
  }

  async updateCurrentMeasureHome(
    measuresHomeDto: MeasuresHomeDto,
  ): Promise<CurrentMeasureHomeEntity> {
    return this.currentMeasureHomeModel
      .findOneAndUpdate(
        { placeName: measuresHomeDto.placeName },
        measuresHomeDto,
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }
}
