import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateSoilReportByLocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsNotEmpty()
  longitude: number;
}