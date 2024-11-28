import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,
  ) {}

  async findBonoByCodigo(codigo: string): Promise<BonoEntity> {
    const bono: BonoEntity = await this.bonoRepository.findOne({
      where: { codigo },
      relations: ['usuario', 'clase'],
    });
    if (!bono) {
      throw new Error('Bono con código ' + codigo + ' no encontrado');
    }
    return bono;
  }

  async crearBono(bono: BonoEntity): Promise<BonoEntity> {
    return await this.bonoRepository.save(bono);
  }

  async deleteBono(id: number) {
    const bono: BonoEntity = await this.bonoRepository.findOne({where: {id}});
    if (!bono) {
      throw new Error('Bono con id ' + id + ' no encontrado');
    }
    await this.bonoRepository.remove(bono);
  }
}
