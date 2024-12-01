import { Module } from '@nestjs/common';
import { BonoService } from '../bono/bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from '../bono/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Module({
  providers: [BonoService],
  imports: [TypeOrmModule.forFeature([BonoEntity, UsuarioEntity])],
})
export class BonoModule {}
