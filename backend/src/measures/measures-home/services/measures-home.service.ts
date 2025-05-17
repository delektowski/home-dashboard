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
    const now = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);


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
          maxTemperature: { $max: "$temperature"},
          minTemperature: { $min: "$temperature"},
          avgTemperature: { $avg: "$temperature" },
          maxHumidity: { $max: "$humidity"},
          minHumidity: { $min: "$humidity"},
          avgHumidity: { $avg: "$humidity" },
          measures: {
            $push: {
              _id: "$_id",
              placeName: "$placeName",
              temperature: { $round: ["$temperature", 0] },
              humidity: { $round: ["$humidity", 0] },
              createdAt: "$createdAt"
            }
          }
        }
      },
      {
        $addFields: {
          maxTemperature: { $round: ["$maxTemperature", 0] },
          minTemperature: { $round: ["$minTemperature", 0] },
          avgTemperature: { $round: ["$avgTemperature", 0] },
          maxHumidity: { $round: ["$maxHumidity", 0] },
          minHumidity: { $round: ["$minHumidity", 0] },
          avgHumidity: { $round: ["$avgHumidity", 0] }
        }
      }
    ]).exec();
  }
}
