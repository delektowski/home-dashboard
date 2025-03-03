import { Test, TestingModule } from '@nestjs/testing';
import { MeasuresHomeResolver } from './measures-home.resolver';

describe('MeasuresHomeResolver', () => {
  let resolver: MeasuresHomeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeasuresHomeResolver],
    }).compile();

    resolver = module.get<MeasuresHomeResolver>(MeasuresHomeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
