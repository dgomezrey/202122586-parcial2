import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaseEntity } from '../clase/clase.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,
  ) {}

  async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
    if (clase.codigo.length !== 10) {
      throw new BusinessLogicException(
        'El código debe tener 10 caracteres',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.claseRepository.save(clase);
  }

  async findClaseById(id: number): Promise<ClaseEntity> {
    const clase: ClaseEntity = await this.claseRepository.findOne({
      where: { id },
      relations: ['usuario', 'bonos'],
    });

    if (!clase) {
      throw new BusinessLogicException(
        'Clase no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return clase;
  }
}
