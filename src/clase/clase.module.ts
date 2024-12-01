import { Module } from '@nestjs/common';
import { ClaseService } from '../clase/clase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from '../clase/clase.entity';
import { ClaseController } from './clase.controller';

@Module({
  providers: [ClaseService],
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  controllers: [ClaseController],
})
export class ClaseModule {}
