import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Module({
  providers: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
})
export class UsuarioModule {}
