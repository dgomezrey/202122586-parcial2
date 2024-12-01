import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ClaseService } from '../clase/clase.service';
import { ClaseDto } from '../clase/clase.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClaseEntity } from '../clase/clase.entity';
import { plainToInstance } from 'class-transformer';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  @Post()
  async crearClase(@Body() claseDto: ClaseDto) {
    const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
    return await this.claseService.crearClase(clase);
  }

  @Get(':claseId')
  async findClaseById(@Param('claseId') claseId: number) {
    return await this.claseService.findClaseById(claseId);
  }
}
