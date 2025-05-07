import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MeasuresHomeService } from './services/measures-home.service';
import { MeasuresHomeModel } from './models/measures-home.model';
import { MeasuresHomeInput } from './models/measures-home-input.model';
import { PubSub } from 'graphql-subscriptions';
import {MeasuresPlaceNamesModel} from "./models/measures-place-names.model";
import {MeasuresPlaceNamesLatest} from "./models/measures-place-names-latest.model";
import {MeasuresHomeAllModel} from "./models/measures-home-all.model";

const pubSub = new PubSub();

@Resolver(() => MeasuresHomeModel)
export class MeasuresHomeResolver {
  constructor(private readonly measuresHomeService: MeasuresHomeService) {}

  @Query(() => [MeasuresHomeModel], {
    name: 'getMeasuresHome',
    description: 'Provides a measures data according to the place name',
    nullable: true,
  })
  async getMeasuresHome(
    @Args('placeName', {
      description: 'Place name where measure device is',
      nullable: false,
    })
    placeName: string,
  ) {
    return this.measuresHomeService.getMeasuresHome(placeName);
  }

  @Query(() => MeasuresHomeModel, {
    name: 'getCurrentMeasureHome',
    description: 'Provides a current measure data according to the place name',
    nullable: true,
  })
  async getCurrentMeasuresHome(
    @Args('placeName', {
      description: 'Place name where measure device is',
      nullable: false,
    })
    placeName: string,
  ) {
    return this.measuresHomeService.getCurrentMeasureHome(placeName);
  }

  @Query(() => [MeasuresPlaceNamesLatest], {
    name: 'getLatestMeasuresForAllPlaces',
    description: 'Provides a latest measures list according to the place name',
    nullable: true,
  })
  async getLatestMeasuresForAllPlaces() {
    const result = await this.measuresHomeService.getLatestMeasuresForAllPlaces();

    return result.placeNames
  }

  @Query(() => [MeasuresHomeAllModel], {
    name: 'getMeasuresForAllPlaces',
    description: 'Provides a measures data matching a 2 days time range',
    nullable: true,
  })
  async getMeasuresForAllPlaces() {
    const {placeNames} = await this.measuresHomeService.getMeasuresForAllPlaces()
    console.log('koko.placeNames',placeNames)
    return placeNames
  }

  @Query(() => MeasuresPlaceNamesModel, {
    name: 'getDistinctPlaceNames',
    description: 'Provides a list of distinct place names',
    nullable: true,
  })
  async getDistinctPlaceNames() {
    const results = await this.measuresHomeService.getDistinctPlaceNames();
    return {
      placeNames: results || []
    };
  }



  @Mutation(() => MeasuresHomeModel)
  async createMeasuresHome(
    @Args('measuresHomeData') measuresHomeData: MeasuresHomeInput,
  ) {
    const isForCurrentMeasure = false;
    const createdAt = new Date();
    const createdMeasuresHome =
      await this.measuresHomeService.createMeasuresHome({
        ...measuresHomeData,
        createdAt,
      });

    await pubSub.publish('measuresHomeAdded', {
      measuresHomeAdded: {
        ...measuresHomeData,
        createdAt,
        isForCurrentMeasure,
      },
    });
    return createdMeasuresHome;
  }

  @Mutation(() => MeasuresHomeModel)
  async createCurrentMeasuresHome(
    @Args('measuresHomeData') measuresHomeData: MeasuresHomeInput,
  ) {
    const isForCurrentMeasure = true;
    const createdAt = new Date();
    const createdCurrentMeasuresHome =
      await this.measuresHomeService.updateCurrentMeasureHome({
        ...measuresHomeData,
        createdAt,
      });
    await pubSub.publish('measuresHomeAdded', {
      measuresHomeAdded: {
        ...measuresHomeData,
        createdAt,
        isForCurrentMeasure,
      },
    });
    return createdCurrentMeasuresHome;
  }

  @Subscription(() => MeasuresHomeModel)
  measuresHomeAdded() {
    return pubSub.asyncIterableIterator('measuresHomeAdded');
  }
}
