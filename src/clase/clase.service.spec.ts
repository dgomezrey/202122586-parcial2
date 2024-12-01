import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { Repository } from 'typeorm';
import { ClaseEntity } from './clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;
  let clasesList: ClaseEntity[];

  const seedDatabase = async () => {
    repository.clear();
    clasesList = [];
    for (let i = 0; i < 5; i++) {
      const clase: ClaseEntity = await repository.save({
        nombre: faker.word.words(3),
        codigo: faker.string.alpha({ length: 10 }),
        numeroCreditos: faker.number.int({ min: 1, max: 10 }),
      });
      clasesList.push(clase);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaseService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearClase debería crear una clase exitosamente', async () => {
    const nuevaClase: ClaseEntity = {
      id: undefined,
      nombre: faker.word.words(3),
      codigo: faker.string.alpha({ length: 10 }),
      numeroCreditos: 4,
      usuario: null,
      bonos: [],
    };

    const resultado = await service.crearClase(nuevaClase);
    expect(resultado).not.toBeNull();

    const storedClase: ClaseEntity = await repository.findOne({
      where: { id: resultado.id },
    });
    expect(storedClase).not.toBeNull();
    expect(storedClase.codigo).toEqual(nuevaClase.codigo);
    expect(storedClase.nombre).toEqual(nuevaClase.nombre);
    expect(storedClase.numeroCreditos).toEqual(nuevaClase.numeroCreditos);
  });

  it('crearClase debería lanzar una excepción si el código no tiene 10 caracteres', async () => {
    const claseInvalida: ClaseEntity = {
      id: undefined,
      nombre: faker.word.words(3),
      codigo: faker.string.alpha({ length: 8 }),
      numeroCreditos: 4,
      usuario: null,
      bonos: [],
    };

    await expect(service.crearClase(claseInvalida)).rejects.toHaveProperty(
      'message',
      'El código debe tener 10 caracteres',
    );
  });

  it('findClaseById debería retornar una clase por ID', async () => {
    const storedClase: ClaseEntity = clasesList[0];
    const clase: ClaseEntity = await service.findClaseById(storedClase.id);
    expect(clase).not.toBeNull();
    expect(clase.id).toEqual(storedClase.id);
    expect(clase.codigo).toEqual(storedClase.codigo);
  });

  it('findClaseById debería lanzar una excepción si la clase no existe', async () => {
    await expect(service.findClaseById(0)).rejects.toHaveProperty(
      'message',
      'Clase no encontrada',
    );
  });
});
