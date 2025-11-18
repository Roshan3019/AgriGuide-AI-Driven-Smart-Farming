import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../entities/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
  ) {}

  async create(createFieldDto: CreateFieldDto, userId: number): Promise<Field> {
    const field = this.fieldsRepository.create({
      ...createFieldDto,
      userId,
    });
    return this.fieldsRepository.save(field);
  }

  async findAll(userId: number): Promise<Field[]> {
    return this.fieldsRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Field> {
    return this.fieldsRepository.findOne({ where: { id, userId } });
  }
}