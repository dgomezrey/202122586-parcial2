import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async findUsuarioById(id: number): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['bonos', 'clases'],
    });
    if (!usuario) {
      throw new Error(`Usuario with id ${id} not found`);
    }
    return usuario;
  }

  //Falta validar
  async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    return await this.usuarioRepository.save(usuario);
  }

  //Falta validar
  async eliminarUsuario(id: number) {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new Error(`Usuario with id ${id} not found`);
    }
    await this.usuarioRepository.remove(usuario);
  }
}
