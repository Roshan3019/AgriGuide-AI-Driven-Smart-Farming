import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from '../entities/field.entity';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { SoilGridsService } from './soilgrids.service';

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  providers: [FieldsService, SoilGridsService],
  controllers: [FieldsController],
  exports: [SoilGridsService],
})
export class FieldsModule {}