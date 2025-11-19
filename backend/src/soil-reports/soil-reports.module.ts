import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoilReport } from '../entities/soil-report.entity';
import { Field } from '../entities/field.entity';
import { SoilReportsService } from './soil-reports.service';
import { SoilReportsController } from './soil-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SoilReport, Field])],
  providers: [SoilReportsService],
  controllers: [SoilReportsController],
})
export class SoilReportsModule {}