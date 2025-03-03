import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MeasuresHomeService } from './services/measures-home.service';
import { MeasuresHomeModel } from './models/measures-home.model';
import { MeasuresHomeInput } from './models/measures-home-input.model';
import { PubSub } from 'graphql-subscriptions';

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
