import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from '../../bono/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [UsuarioEntity, BonoEntity, ClaseEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([UsuarioEntity, BonoEntity, ClaseEntity]),
];