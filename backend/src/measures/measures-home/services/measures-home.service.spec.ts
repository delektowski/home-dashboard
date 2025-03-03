import { Test, TestingModule } from '@nestjs/testing';
import { MeasuresHomeService } from './measures-home.service';

describe('MeasuresHomeService', () => {
  let service: MeasuresHomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeasuresHomeService],
    }).compile();

    service = module.get<MeasuresHomeService>(MeasuresHomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
