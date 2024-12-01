import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];

  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await repository.save({
        nombre: faker.person.firstName(),
        numeroCedula: faker.number.int(),
        grupoInvestigacion: 'TICSW',
        numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
      });
      usuariosList.push(usuario);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearUsuario debería crear un usuario exitosamente', async () => {
    const nuevoUsuario: UsuarioEntity = {
      id: undefined,
      nombre: faker.person.firstName(),
      numeroCedula: faker.number.int(),
      grupoInvestigacion: 'IMAGINE',
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      bonos: [],
      clases: [],
      jefe: null,
    };

    const resultado = await service.crearUsuario(nuevoUsuario);
    expect(resultado).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: resultado.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(nuevoUsuario.nombre);
    expect(storedUsuario.grupoInvestigacion).toEqual(
      nuevoUsuario.grupoInvestigacion,
    );
    expect(storedUsuario.rol).toEqual(nuevoUsuario.rol);
  });

  it('crearUsuario debería lanzar una excepción para un rol inválido', async () => {
    const usuarioInvalido: UsuarioEntity = {
      id: undefined,
      nombre: faker.person.firstName(),
      numeroCedula: faker.number.int(),
      grupoInvestigacion: 'COMIT',
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Estudiante',
      bonos: [],
      clases: [],
      jefe: null,
    };

    await expect(service.crearUsuario(usuarioInvalido)).rejects.toHaveProperty(
      'message',
      'Rol invalido',
    );
  });

  it('findUsuarioById debería retornar un usuario por ID', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findUsuarioById(
      storedUsuario.id,
    );
    expect(usuario).not.toBeNull();
    expect(usuario.id).toEqual(storedUsuario.id);
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
  });

  it('findUsuarioById debería lanzar una excepción si el usuario no existe', async () => {
    await expect(service.findUsuarioById(0)).rejects.toHaveProperty(
      'message',
      'Usuario con el id indicado no fue encontrado',
    );
  });

  it('eliminarUsuario debería eliminar un usuario exitosamente', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.eliminarUsuario(usuario.id);

    const usuarioEliminado: UsuarioEntity = await repository.findOne({
      where: { id: usuario.id },
    });
    expect(usuarioEliminado).toBeNull();
  });

  it('eliminarUsuario debería lanzar una excepción si el usuario es Decana', async () => {
    const usuarioDecana: UsuarioEntity = await repository.save({
      nombre: faker.person.firstName(),
      numeroCedula: faker.number.int(),
      grupoInvestigacion: 'TICSW',
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Decana',
    });

    await expect(
      service.eliminarUsuario(usuarioDecana.id),
    ).rejects.toHaveProperty(
      'message',
      'No se puede eliminar a un usuario con rol de Decana',
    );
  });
});
