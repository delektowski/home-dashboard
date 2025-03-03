import { Body, Controller, Post } from '@nestjs/common';
import { MeasuresHomeDto } from './dto/measures-home.dto';
import { MeasuresHomeService } from './services/measures-home.service';

@Controller('measures-home')
export class MeasuresHomeController {
  constructor(private readonly measuresHomeService: MeasuresHomeService) {}

  @Post()
  createMeasuresHome(@Body() measuresHomeDto: MeasuresHomeDto) {
    return this.measuresHomeService.createMeasuresHome(measuresHomeDto);
  }
}
