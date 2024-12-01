import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('BonoService', () => {
  let service: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let bonosList: BonoEntity[];
  let usuario: UsuarioEntity;

  const seedDatabase = async () => {
    bonoRepository.clear();
    usuarioRepository.clear();
    usuario = await usuarioRepository.save({
      nombre: faker.person.firstName(),
      numeroCedula: faker.number.int(),
      grupoInvestigacion: 'TICSW',
      numeroExtension: 12345678,
      rol: 'Profesor',
    });

    bonosList = [];
    for (let i = 0; i < 5; i++) {
      const bono: BonoEntity = await bonoRepository.save({
        monto: faker.number.int({ min: 1, max: 1000 }),
        calificacion: faker.number.float({ min: 1, max: 4 }),
        palabraClave: faker.string.alpha(10),
        usuario,
      });
      bonosList.push(bono);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(
      getRepositoryToken(BonoEntity),
    );
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findBonoById should return a bono by ID', async () => {
    const storedBono: BonoEntity = bonosList[0];
    const bono: BonoEntity = await service.findBonoById(storedBono.id);
    expect(bono).not.toBeNull();
    expect(bono.id).toEqual(storedBono.id);
    expect(bono.monto).toEqual(storedBono.monto);
  });

  it('findBonoById should throw an exception for an invalid ID', async () => {
    await expect(service.findBonoById(0)).rejects.toHaveProperty(
      'message',
      'Bono con el id indicado no fue encontrado',
    );
  });

  it('crearBono should create a new bono', async () => {
    const nuevoBono: BonoEntity = {
      id: undefined,
      monto: 500,
      calificacion: 3.5,
      palabraClave: 'nuevoBono',
      usuario,
      clase: null,
    };

    const resultado = await service.crearBono(nuevoBono);
    expect(resultado).not.toBeNull();

    const storedBono: BonoEntity = await bonoRepository.findOne({
      where: { id: resultado.id },
    });
    expect(storedBono).not.toBeNull();
    expect(storedBono.monto).toEqual(nuevoBono.monto);
  });

  it('crearBono should throw an exception for an invalid monto', async () => {
    const bonoInvalido: BonoEntity = {
      id: undefined,
      monto: -10,
      calificacion: 3.5,
      palabraClave: 'invalidoBono',
      usuario,
      clase: null,
    };

    await expect(service.crearBono(bonoInvalido)).rejects.toHaveProperty(
      'message',
      'El monto del bono debe ser mayor a 0',
    );
  });

  it('findAllBonosByUsuario should return all bonos for a valid user', async () => {
    const resultado = await service.findAllBonosByUsuario(usuario.id);
    expect(resultado).not.toBeNull();
    expect(resultado).toHaveLength(bonosList.length);
  });

  it('findAllBonosByUsuario should throw an exception for an invalid user', async () => {
    await expect(service.findAllBonosByUsuario(0)).rejects.toHaveProperty(
      'message',
      'Usuario con el id indicado no fue encontrado',
    );
  });

  it('deleteBono should delete a bono', async () => {
    const bono: BonoEntity = bonosList[0];
    await service.deleteBono(bono.id);
    const deletedBono = await bonoRepository.findOne({
      where: { id: bono.id },
    });
    expect(deletedBono).toBeNull();
  });

  it('deleteBono should throw an exception if calificacion is greater than 4', async () => {
    const bonoInvalido = await bonoRepository.save({
      monto: 1000,
      calificacion: 4.5,
      palabraClave: 'calificacionAlta',
      usuario,
    });

    await expect(service.deleteBono(bonoInvalido.id)).rejects.toHaveProperty(
      'message',
      'No se puede eliminar un bono con calificación mayor a 4',
    );
  });
});
