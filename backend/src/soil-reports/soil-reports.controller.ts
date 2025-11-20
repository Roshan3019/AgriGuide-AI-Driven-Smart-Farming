import { Controller, Get, Post, Body, Param, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { SoilReportsService } from './soil-reports.service';
import { CreateSoilReportDto } from './dto/create-soil-report.dto';
import { CreateSoilReportByLocationDto } from './dto/create-soil-report-by-location.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('soil-reports')
@UseGuards(JwtAuthGuard)
export class SoilReportsController {
  constructor(private readonly soilReportsService: SoilReportsService) {}

  @Post()
  create(@Body(ValidationPipe) createSoilReportDto: CreateSoilReportDto, @Request() req) {
    return this.soilReportsService.create(createSoilReportDto, req.user.id);
  }

  @Post('by-location')
  createByLocation(@Body(ValidationPipe) createByLocationDto: CreateSoilReportByLocationDto, @Request() req) {
    return this.soilReportsService.createByLocation(createByLocationDto, req.user.id);
  }

  @Get('field/:fieldId')
  findByFieldId(@Param('fieldId') fieldId: string) {
    return this.soilReportsService.findByFieldId(+fieldId);
  }
}