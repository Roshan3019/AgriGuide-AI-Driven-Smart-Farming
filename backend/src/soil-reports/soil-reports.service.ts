import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoilReport } from '../entities/soil-report.entity';
import { Field } from '../entities/field.entity';
import { CreateSoilReportDto } from './dto/create-soil-report.dto';
import { CreateSoilReportByLocationDto } from './dto/create-soil-report-by-location.dto';
import { calculateFertilityCategory, generateRecommendations, getMockSoilDataForLocation } from './soil-utils';

@Injectable()
export class SoilReportsService {
  constructor(
    @InjectRepository(SoilReport)
    private soilReportsRepository: Repository<SoilReport>,
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
  ) {}

  async create(createSoilReportDto: CreateSoilReportDto, userId: number): Promise<SoilReport> {
    const { fieldId, pH, nitrogen, phosphorus, potassium, organicCarbon, moisture } = createSoilReportDto;

    let field: Field;

    if (fieldId) {
      // If fieldId provided, validate it exists and belongs to user
      field = await this.fieldsRepository.findOne({ where: { id: fieldId } });
      if (!field) {
        throw new NotFoundException('Field not found');
      }
      if (field.userId !== userId) {
        throw new ForbiddenException('Field does not belong to this user');
      }
    } else {
      // If no fieldId, find first field for user or create default
      field = await this.fieldsRepository.findOne({ where: { userId } });
      if (!field) {
        // Create default field
        field = this.fieldsRepository.create({
          name: 'Default Field',
          location: '0,0', // Will be updated if using location
          size: 1,
          userId,
        });
        field = await this.fieldsRepository.save(field);
      }
    }

    const fertilityCategory = calculateFertilityCategory(nitrogen, phosphorus, potassium, pH, organicCarbon);
    const recommendations = generateRecommendations(nitrogen, phosphorus, potassium, pH, organicCarbon);

    const soilReport = this.soilReportsRepository.create({
      fieldId: field.id,
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

  async createByLocation(createByLocationDto: CreateSoilReportByLocationDto, userId: number): Promise<SoilReport> {
    const { latitude, longitude } = createByLocationDto;

    // Get mock soil data
    const soilData = getMockSoilDataForLocation(latitude, longitude);

    // Find or create field
    let field = await this.fieldsRepository.findOne({ where: { userId } });
    if (!field) {
      // Create default field with location
      field = this.fieldsRepository.create({
        name: 'Default Field',
        location: `${latitude},${longitude}`,
        size: 1,
        userId,
      });
      field = await this.fieldsRepository.save(field);
    }

    const fertilityCategory = calculateFertilityCategory(
      soilData.nitrogen,
      soilData.phosphorus,
      soilData.potassium,
      soilData.pH,
      soilData.organicCarbon
    );
    const recommendations = generateRecommendations(
      soilData.nitrogen,
      soilData.phosphorus,
      soilData.potassium,
      soilData.pH,
      soilData.organicCarbon
    );

    const soilReport = this.soilReportsRepository.create({
      fieldId: field.id,
      field,
      pH: soilData.pH,
      nitrogen: soilData.nitrogen,
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      organicCarbon: soilData.organicCarbon,
      moisture: soilData.moisture,
      fertilityCategory,
      recommendations,
    });

    return this.soilReportsRepository.save(soilReport);
  }

  async findByFieldId(fieldId: number): Promise<SoilReport[]> {
    return this.soilReportsRepository.find({ where: { fieldId } });
  }
}