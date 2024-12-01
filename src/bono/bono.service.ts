import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from '../bono/bono.entity';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async crearBono(bono: BonoEntity): Promise<BonoEntity> {
    if (bono.monto <= 0) {
      throw new BusinessLogicException(
        'El monto del bono debe ser mayor a 0',
        BusinessError.BAD_REQUEST,
      );
    }

    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: bono.usuario.id },
    });

    if (!usuario) {
      throw new BusinessLogicException(
        'Usuario no encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (usuario.rol !== 'Profesor') {
      throw new BusinessLogicException(
        'Solo los usuarios con rol de Profesor pueden tener bonos',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.bonoRepository.save(bono);
  }

  async findBonoById(id: number): Promise<BonoEntity> {
    const bono: BonoEntity = await this.bonoRepository.findOne({
      where: { id },
      relations: ['usuario', 'clase'],
    });

    if (!bono) {
      throw new BusinessLogicException(
        'Bono con el id indicado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return bono;
  }

  async findAllBonosByUsuario(userId: number): Promise<BonoEntity[]> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['bonos'],
    });

    if (!usuario) {
      throw new BusinessLogicException(
        'Usuario con el id indicado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return usuario.bonos;
  }

  async deleteBono(id: number) {
    const bono: BonoEntity = await this.bonoRepository.findOne({
      where: { id },
    });

    if (!bono) {
      throw new BusinessLogicException(
        'Bono con el id indicado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (bono.calificacion > 4) {
      throw new BusinessLogicException(
        'No se puede eliminar un bono con calificación mayor a 4',
        BusinessError.BAD_REQUEST,
      );
    }

    await this.bonoRepository.remove(bono);
  }
}
