import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { BonoModule } from './bono/bono.module';
import { ClaseModule } from './clase/clase.module';
import { UsuarioEntity } from './usuario/usuario.entity';
import { ClaseEntity } from './clase/clase.entity';
import { BonoEntity } from './bono/bono.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [UsuarioEntity, ClaseEntity, BonoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    UsuarioModule,
    BonoModule,
    ClaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
