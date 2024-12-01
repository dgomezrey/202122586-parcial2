import { Module } from '@nestjs/common';
import { BonoService } from '../bono/bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from '../bono/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { BonoController } from './bono.controller';

@Module({
  providers: [BonoService],
  imports: [TypeOrmModule.forFeature([BonoEntity, UsuarioEntity])],
  controllers: [BonoController],
})
export class BonoModule {}
