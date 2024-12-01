import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  private gruposValidos = ['TICSW', 'IMAGINE', 'COMIT'];

  private usuariosValidos = ['Decana', 'Profesor'];

  async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    console.log('ENTRA AL METODO');
    if (!this.usuariosValidos.includes(usuario.rol)) {
      throw new BusinessLogicException(
        'Rol invalido',
        BusinessError.BAD_REQUEST,
      );
    }

    console.log('PASA EL ROL');

    if (
      !this.gruposValidos.includes(usuario.grupoInvestigacion) &&
      usuario.rol === 'Profesor'
    ) {
      throw new BusinessLogicException(
        'Grupo de investigacion invalido',
        BusinessError.BAD_REQUEST,
      );
    }

    console.log('PASA EL GRUPO');

    if (
      usuario.rol === 'Decana' &&
      usuario.numeroExtension.toString().length !== 8
    ) {
      throw new BusinessLogicException(
        'Numero de extension invalido',
        BusinessError.BAD_REQUEST,
      );
    }

    console.log('PASA LA EXTENSION');

    return await this.usuarioRepository.save(usuario);
  }

  async findUsuarioById(id: number): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['bonos', 'clases'],
    });
    if (!usuario) {
      throw new BusinessLogicException(
        'Usuario con el id indicado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return usuario;
  }

  async eliminarUsuario(id: number) {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new Error(`Usuario with id ${id} not found`);
    }

    if (usuario.rol === 'Decana') {
      throw new BusinessLogicException(
        'No se puede eliminar a un usuario con rol de Decana',
        BusinessError.BAD_REQUEST,
      );
    }

    const bonosAsociados = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.bonos', 'bono')
      .where('usuario.id = :id', { id })
      .getOne();
    if (bonosAsociados?.bonos?.length > 0) {
      throw new BusinessLogicException(
        'No se puede eliminar a un usuario con bonos asociados',
        BusinessError.BAD_REQUEST,
      );
    }

    await this.usuarioRepository.remove(usuario);
  }
}
