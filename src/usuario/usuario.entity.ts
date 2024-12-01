import { BonoEntity } from '../bono/bono.entity';
import { ClaseEntity } from '../clase/clase.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', unique: true })
  numeroCedula: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  grupoInvestigacion: string;

  @Column({ type: 'int' })
  numeroExtension: number;

  @Column({ type: 'varchar', length: 255 })
  rol: string;

  @Column({ type: 'varchar', nullable: true })
  subordinados?: UsuarioEntity[];

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.subordinados, {
    nullable: true,
  })
  jefe: UsuarioEntity;

  @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
  clases: ClaseEntity[];

  @OneToMany(() => BonoEntity, (bono) => bono.usuario)
  bonos: BonoEntity[];
}
