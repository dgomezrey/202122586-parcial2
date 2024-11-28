import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  grupo_investigacion: string;

  @Column()
  extension: number;

  @Column()
  rol: string;

  @OneToMany(() => BonoEntity, (bono) => bono.usuario)
  bonos: BonoEntity[];

  @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
  clases: ClaseEntity[];

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.subordinados, {
    nullable: true,
  })
  jefe: UsuarioEntity;

  @OneToMany(() => UsuarioEntity, (usuario) => usuario.jefe)
  subordinados: UsuarioEntity[];
}
