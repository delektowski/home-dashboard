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

  async getMeasuresForAllPlaces(): Promise<{ placeNames: any[] }> {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const now = new Date();

    const results = await this.measuresHomeModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: twoDaysAgo,
            $lte: now
          }
        }
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$placeName",
         
          measures: {
            $push: {
              _id: "$_id",
              placeName: "$placeName",
              temperature: "$temperature",
              humidity: "$humidity",
              createdAt: "$createdAt"
            }
          }
        }
      }
    ]).exec();

    console.log('results with grouping', results[0]);
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
