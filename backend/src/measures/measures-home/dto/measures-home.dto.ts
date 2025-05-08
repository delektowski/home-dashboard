import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class MeasuresHomeDto {
  @IsNumber()
  id?: string;

  @IsString()
  placeName: string;

  @IsNumber()
  @Min(-50)
  @Max(50)
  temperature: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsDate()
  createdAt: Date;

}
