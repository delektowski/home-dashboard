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
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);


    const now = new Date()
    return this.measuresHomeModel.find({
      placeName,
      createdAt: {
        $gte: startOfYesterday,
        $lte: now
      }
    }).exec();
  }

  async getDistinctPlaceNames(): Promise<string[]> {
    return this.measuresHomeModel.distinct('placeName').exec();
  }

  async getCurrentMeasureHome(
    placeName: string,
  ): Promise<CurrentMeasureHomeEntity | null> {
    return this.currentMeasureHomeModel.findOne({ placeName }).exec();
  }

  async getLatestMeasuresForAllPlaces(): Promise<{ placeNames: MeasuresHomeEntity[] }> {
    const results = await this.measuresHomeModel.aggregate([
      { $sort: { placeName: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$placeName",
          temperature: { $first: "$temperature" },
          humidity: { $first: "$humidity" },
          placeName: { $first: "$placeName" },
          createdAt: { $first: "$createdAt" }
        }
      }
    ]).exec();

    return { placeNames: results };
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
