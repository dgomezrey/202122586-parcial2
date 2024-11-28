import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,
  ) {}

  async findClaseById(id: number): Promise<ClaseEntity> {
    const clase: ClaseEntity = await this.claseRepository.findOne({
      where: { id },
      relations: ['usuario', 'bonos'],
    });
    if (!clase) {
      throw new Error(`Clase with id ${id} not found`);
    }
    return clase;
  }

  // Falta validar
  async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
    return await this.claseRepository.save(clase);
  }
}
