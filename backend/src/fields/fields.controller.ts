import { Controller, Get, Post, Body, Param, UseGuards, Request, ValidationPipe, Query } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { SoilGridsService } from './soilgrids.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("fields")
@UseGuards(JwtAuthGuard)
export class FieldsController {
  constructor(
    private readonly fieldsService: FieldsService,
    private readonly soilGridsService: SoilGridsService
  ) {}

  @Post()
  create(@Body(ValidationPipe) createFieldDto: CreateFieldDto, @Request() req) {
    return this.fieldsService.create(createFieldDto, req.user.id);
  }
  @Get("soilgrids-test")
  async testSoilGrids(
    @Query("lat") lat: string,
    @Query("lng") lng: string,
    @Request() req
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return { error: "Invalid latitude or longitude" };
    }

    const result = await this.soilGridsService.fetchSoilGridsData(
      latitude,
      longitude
    );
    return result;
  }
  @Get()
  findAll(@Request() req) {
    return this.fieldsService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Request() req) {
    return this.fieldsService.findOne(+id, req.user.id);
  }
}