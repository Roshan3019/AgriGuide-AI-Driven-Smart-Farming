import { Controller, Get, Post, Body, Param, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fields')
@UseGuards(JwtAuthGuard)
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  create(@Body(ValidationPipe) createFieldDto: CreateFieldDto, @Request() req) {
    return this.fieldsService.create(createFieldDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.fieldsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.fieldsService.findOne(+id, req.user.id);
  }
}