import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MeasuresHomeService } from './services/measures-home.service';
import { MeasuresHomeModel } from './models/measures-home.model';
import { MeasuresHomeInput } from './models/measures-home-input.model';
import { MeasuresHomeAllModel } from './models/measures-home-all.model';

@Resolver(() => MeasuresHomeModel)
export class MeasuresHomeResolver {
  constructor(private readonly measuresHomeService: MeasuresHomeService) {}

  @Query(() => [MeasuresHomeAllModel], {
    name: 'getMeasuresForAllPlaces',
    description: 'Provides a measures data matching a 2 days time range',
    nullable: true,
  })
  async getMeasuresForAllPlaces() {
    return await this.measuresHomeService.getMeasuresForAllPlaces();
  }

  @Mutation(() => MeasuresHomeModel)
  async createMeasuresHome(
    @Args('measuresHomeData') measuresHomeData: MeasuresHomeInput,
  ) {
    const createdAt = new Date();
    return await this.measuresHomeService.createMeasuresHome({
      ...measuresHomeData,
      createdAt,
    });
  }
}
