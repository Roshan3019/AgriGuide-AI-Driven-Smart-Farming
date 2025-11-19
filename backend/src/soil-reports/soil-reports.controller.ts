import { Controller, Get, Post, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { SoilReportsService } from './soil-reports.service';
import { CreateSoilReportDto } from './dto/create-soil-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('soil-reports')
@UseGuards(JwtAuthGuard)
export class SoilReportsController {
  constructor(private readonly soilReportsService: SoilReportsService) {}

  @Post()
  create(@Body(ValidationPipe) createSoilReportDto: CreateSoilReportDto) {
    return this.soilReportsService.create(createSoilReportDto);
  }

  @Get('field/:fieldId')
  findByFieldId(@Param('fieldId') fieldId: string) {
    return this.soilReportsService.findByFieldId(+fieldId);
  }
}