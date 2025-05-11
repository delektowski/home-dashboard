import { Injectable } from '@nestjs/common';
import { MeasuresHomeDto } from '../dto/measures-home.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeasuresHomeEntity } from '../schemas/measures-home.schema';
import {MeasuresHomeModel} from "../models/measures-home.model";

@Injectable()
export class MeasuresHomeService {
  constructor(
    @InjectModel(MeasuresHomeEntity.name)
    private measuresHomeModel: Model<MeasuresHomeEntity>,
  ) {}

  async createMeasuresHome(
    measuresHomeDto: MeasuresHomeDto,
  ): Promise<MeasuresHomeEntity> {
    const createMeasuresHome = new this.measuresHomeModel(measuresHomeDto);
    return createMeasuresHome.save();
  }

  async getMeasuresForAllPlaces(): Promise<MeasuresHomeModel[]> {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const now = new Date();

    return await this.measuresHomeModel.aggregate([
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
  }
}
