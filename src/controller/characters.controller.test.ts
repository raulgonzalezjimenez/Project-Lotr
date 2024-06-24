import { type Request, type Response } from 'express';
import { type CharacterSqlRepo } from '../repositories/characters.sql.repo';
import { CharacterController } from './characters.controller';
import { type Character } from '../entities/character';

describe('Given an instance of the class CharacterController', () => {
  const repo = {
    create: jest.fn().mockReturnValue({} as Character),
    searchForRace: jest.fn().mockResolvedValue([]),
  } as unknown as CharacterSqlRepo;

  const req = {
    params: {
      race: 'elf', // Simula un parámetro de ruta "race"
    },
  } as unknown as Request;
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new CharacterController(repo);

  test('Then it should be an instance of the class', () => {
    expect(controller).toBeInstanceOf(CharacterController);
  });

  describe('When we use the method getByRace', () => {
    test('Then it should call repo.searchForRace with the race parameter', async () => {
      await controller.getByRace(req, res, next);
      expect(repo.searchForRace).toHaveBeenCalledWith('elf'); // Comprueba que se llama a repo.searchForRace con el parámetro correcto
      expect(res.json).toHaveBeenCalledWith([]); // Comprueba que se envía la respuesta JSON con el resultado
      expect(next).not.toHaveBeenCalled(); // Comprueba que next no se llama si no hay errores
    });

    test('Then it should call next with an error if repo.searchForRace throws an error', async () => {
      const error = new Error('Test error');
      (repo.searchForRace as jest.Mock).mockRejectedValue(error); // Simula un error al llamar a repo.searchForRace
      await controller.getByRace(req, res, next);
      expect(next).toHaveBeenCalledWith(error); // Comprueba que next se llama con el error
    });
  });
});

describe('Given a instance of the class CharacterController', () => {
  const repo = {
    create: jest.fn().mockReturnValue({} as Character),
  } as unknown as CharacterSqlRepo;

  const req = {
    body: {} as unknown as Character,
    file: {
      destination: '/temp',
      filename: 'test.png',
    },
  } as unknown as Request;
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new CharacterController(repo);

  test('Then it should be instance of the class', () => {
    expect(controller).toBeInstanceOf(CharacterController);
  });

  describe('When we use the method create', () => {
    test('Then it should call repo.create', async () => {
      const character = {
        name: 'title',
        userId: 'test',
        race: 'elve',
        faction: 'gondor',
        imgUrl: 'test',
        description: 'testt',
      };
      const validateCharacter = {
        ...character,
      };
      req.body = { ...character, payload: { id: 'test' } };
      (repo.create as jest.Mock).mockResolvedValue(character);
      await controller.create(req, res, next);
      expect(repo.create).toHaveBeenCalledWith(validateCharacter);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(character);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
