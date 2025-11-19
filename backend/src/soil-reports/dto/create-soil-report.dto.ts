import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateSoilReportDto {
  @IsNumber()
  @IsNotEmpty()
  fieldId: number;

  @IsNumber()
  @Min(0)
  @Max(14)
  pH: number;

  @IsNumber()
  @Min(0)
  nitrogen: number;

  @IsNumber()
  @Min(0)
  phosphorus: number;

  @IsNumber()
  @Min(0)
  potassium: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  organicCarbon: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  moisture: number;
}