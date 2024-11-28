import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity/bono.entity';

@Module({
  providers: [BonoService],
  imports: [TypeOrmModule.forFeature([BonoEntity])],
})
export class BonoModule {}
