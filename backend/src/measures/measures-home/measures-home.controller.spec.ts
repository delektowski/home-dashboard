import { Test, TestingModule } from '@nestjs/testing';
import { MeasuresHomeController } from './measures-home.controller';

describe('MeasuresHomeController', () => {
  let controller: MeasuresHomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasuresHomeController],
    }).compile();

    controller = module.get<MeasuresHomeController>(MeasuresHomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
