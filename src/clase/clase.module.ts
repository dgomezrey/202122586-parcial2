import { Module } from '@nestjs/common';
import { ClaseService } from '../clase/clase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from '../clase/clase.entity';

@Module({
  providers: [ClaseService],
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
})
export class ClaseModule {}
