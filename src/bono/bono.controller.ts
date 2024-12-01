import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BonoService } from '../bono/bono.service';
import { BonoDto } from '../bono/bono.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BonoEntity } from '../bono/bono.entity';
import { plainToInstance } from 'class-transformer';

@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}

  @Post()
  async crearBono(@Body() bonoDto: BonoDto) {
    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
    return await this.bonoService.crearBono(bono);
  }

  @Get(':bonoId')
  async findBonoById(@Param('bonoId') bonoId: number) {
    return await this.bonoService.findBonoById(bonoId);
  }

  @Get('usuario/:usuarioId')
  async findAllBonosByUsuarioId(@Param('usuarioId') usuarioId: number) {
    return await this.bonoService.findAllBonosByUsuario(usuarioId);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async delete(@Param('bonoId') bonoId: number) {
    return await this.bonoService.deleteBono(bonoId);
  }
}
