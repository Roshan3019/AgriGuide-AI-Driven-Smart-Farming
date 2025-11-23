import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../entities/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { SoilGridsService } from './soilgrids.service';

@Injectable()
export class FieldsService {
  private readonly logger = new Logger(FieldsService.name);

  constructor(
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
    private readonly soilGridsService: SoilGridsService,
  ) {}

  async create(createFieldDto: CreateFieldDto, userId: number): Promise<Field> {
    this.logger.debug(`[FieldsService] Creating field for user ${userId}: ${JSON.stringify(createFieldDto)}`);

    const field = this.fieldsRepository.create({
      ...createFieldDto,
      userId,
    });

    // If latitude and longitude are provided, fetch baseline soil data from SoilGrids
    if (createFieldDto.latitude !== undefined && createFieldDto.longitude !== undefined) {
      this.logger.debug(`[FieldsService] Fetching SoilGrids data for lat=${createFieldDto.latitude}, lng=${createFieldDto.longitude}`);
      const soilData = await this.soilGridsService.fetchSoilGridsData(createFieldDto.latitude, createFieldDto.longitude);

      this.logger.debug(`[FieldsService] SoilGrids returned: ${JSON.stringify(soilData)}`);

      if (soilData.ph !== undefined) {
        field.baselinePh = soilData.ph;
        this.logger.debug(`[FieldsService] Set baselinePh: ${soilData.ph}`);
      }
      if (soilData.organicCarbon !== undefined) {
        field.baselineOrganicCarbon = soilData.organicCarbon;
        this.logger.debug(`[FieldsService] Set baselineOrganicCarbon: ${soilData.organicCarbon}`);
      }
      if (soilData.clayPercent !== undefined) {
        field.baselineClayPercent = soilData.clayPercent;
        this.logger.debug(`[FieldsService] Set baselineClayPercent: ${soilData.clayPercent}`);
      }
      if (soilData.sandPercent !== undefined) {
        field.baselineSandPercent = soilData.sandPercent;
        this.logger.debug(`[FieldsService] Set baselineSandPercent: ${soilData.sandPercent}`);
      }
    } else {
      this.logger.debug(`[FieldsService] No coordinates provided, skipping SoilGrids fetch`);
    }

    const savedField = await this.fieldsRepository.save(field);
    this.logger.debug(`[FieldsService] Field saved with id ${savedField.id}, baseline values: ph=${savedField.baselinePh}, oc=${savedField.baselineOrganicCarbon}, clay=${savedField.baselineClayPercent}, sand=${savedField.baselineSandPercent}`);

    return savedField;
  }

  async findAll(userId: number): Promise<Field[]> {
    return this.fieldsRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Field> {
    return this.fieldsRepository.findOne({ where: { id, userId } });
  }
}