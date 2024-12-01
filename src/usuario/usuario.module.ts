import { Module } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioController } from './usuario.controller';

@Module({
  providers: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
