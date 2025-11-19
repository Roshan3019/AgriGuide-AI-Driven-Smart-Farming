import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoilReport } from '../entities/soil-report.entity';
import { Field } from '../entities/field.entity';
import { CreateSoilReportDto } from './dto/create-soil-report.dto';
import { calculateFertilityCategory, generateRecommendations } from './soil-utils';

@Injectable()
export class SoilReportsService {
  constructor(
    @InjectRepository(SoilReport)
    private soilReportsRepository: Repository<SoilReport>,
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
  ) {}

  async create(createSoilReportDto: CreateSoilReportDto): Promise<SoilReport> {
    const { fieldId, pH, nitrogen, phosphorus, potassium, organicCarbon, moisture } = createSoilReportDto;

    const field = await this.fieldsRepository.findOne({ where: { id: fieldId } });
    if (!field) {
      throw new NotFoundException('Field not found');
    }

    const fertilityCategory = calculateFertilityCategory(nitrogen, phosphorus, potassium, pH, organicCarbon);
    const recommendations = generateRecommendations(nitrogen, phosphorus, potassium, pH, organicCarbon);

    const soilReport = this.soilReportsRepository.create({
      fieldId,
      field,
      pH,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon,
      moisture,
      fertilityCategory,
      recommendations,
    });

    return this.soilReportsRepository.save(soilReport);
  }

  async findByFieldId(fieldId: number): Promise<SoilReport[]> {
    return this.soilReportsRepository.find({ where: { fieldId } });
  }
}