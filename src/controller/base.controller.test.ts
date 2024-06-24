import { type Request, type Response } from 'express';
import { HttpError } from '../middleware/errors.middleware';
import { BaseController } from './base.controller';
import { type Repo } from '../repositories/type.repo';
import { type ObjectSchema } from 'joi';

type TestModel = Record<string, unknown>;
type TestCreateDto = Record<string, unknown>;
const testCreateDtoSchema = {
  validate: jest.fn().mockReturnValue({ error: null, value: {} }),
} as unknown as ObjectSchema<TestCreateDto>;
const testUpdateDtoSchema = {
  validate: jest.fn().mockReturnValue({ error: null, value: {} }),
} as unknown as ObjectSchema<TestCreateDto>;

export class TestController extends BaseController<TestModel, TestCreateDto> {
  constructor(protected readonly repo: Repo<TestModel, TestCreateDto>) {
    super(repo, testCreateDtoSchema, testUpdateDtoSchema);
  }
}

describe('Given a instance of the class TestController', () => {
  const repo = {
    readAll: jest.fn(),
    readById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as Repo<TestModel, TestCreateDto>;

  const req = {} as unknown as Request;
  const res = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new TestController(repo);
  test('Then it should be instance of the class', () => {
    expect(controller).toBeInstanceOf(TestController);
  });

  describe('When we use the method getAll', () => {
    test('Then it should call repo.readAll', async () => {
      (repo.readAll as jest.Mock).mockResolvedValue([]);
      await controller.getAll(req, res, next);
      expect(repo.readAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('When we use the method getAll and repo throw an ERROR', () => {
    test('Then it should call repo.readAll and next', async () => {
      const error = new Error('Something went wrong');
      (repo.readAll as jest.Mock).mockRejectedValue(error);
      await controller.getAll(req, res, next);
      expect(repo.readAll).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we use the method getById', () => {
    test('Then it should call repo.readById', async () => {
      (repo.readById as jest.Mock).mockResolvedValue({});
      req.params = { id: '1' };
      await controller.getById(req, res, next);
      expect(repo.readById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we use the method getById and repo throw an ERROR', () => {
    test('Then it should call repo.readById and next', async () => {
      const error = new Error('Something went wrong');
      (repo.readById as jest.Mock).mockRejectedValue(error);
      req.params = { id: '1' };
      await controller.getById(req, res, next);
      expect(repo.readById).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we use the method create', () => {
    test('Then it should call repo.create', async () => {
      const character = { test: 'test' };
      req.body = character;
      (repo.create as jest.Mock).mockResolvedValue(character);
      await controller.create(req, res, next);
      expect(repo.create).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we use the method create with INVALID data', () => {
    test('Then it should call next with an error', async () => {
      (testCreateDtoSchema.validate as jest.Mock).mockReturnValueOnce({
        error: new Error('error'),
        value: {},
      });
      const character = { mame: 'name' };
      req.body = character;
      await controller.create(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'error')
      );
    });
  });

  describe('When we use the method create and repo throw an ERROR', () => {
    test('Then it should call repo.create and next', async () => {
      const error = new Error('Something went wrong');
      (repo.create as jest.Mock).mockRejectedValue(error);
      const character = { name: 'name', userId: 'userId' };
      req.body = character;
      await controller.create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we use the method update', () => {
    test('Then it should call repo.update', async () => {
      const character = { name: 'name', faction: 'faction' };
      req.params = { id: '1' };
      req.body = character;
      (repo.update as jest.Mock).mockResolvedValue(character);
      await controller.update(req, res, next);
      expect(repo.update).toHaveBeenCalledWith('1', character);
      expect(res.json).toHaveBeenCalledWith(character);
    });
  });

  describe('When we use the method update with INVALID data', () => {
    test('Then it should call next with an error', async () => {
      (testUpdateDtoSchema.validate as jest.Mock).mockReturnValueOnce({
        error: new Error('error'),
        value: {},
      });
      const character = { userId: 34 };
      req.body = character;
      await controller.update(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'error')
      );
    });
  });

  describe('When we use the method update and repo throw an ERROR', () => {
    test('Then it should call repo.update and next', async () => {
      const error = new Error('Something went wrong');
      (repo.update as jest.Mock).mockRejectedValue(error);
      const character = { name: 'name', userId: 'test' };
      req.body = character;
      await controller.update(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When we use the method delete', () => {
    test('Then it should call repo.delete', async () => {
      req.params = { id: '1' };
      (repo.delete as jest.Mock).mockResolvedValue({});
      await controller.delete(req, res, next);
      expect(repo.delete).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we use the method delete and repo throw an ERROR', () => {
    test('Then it should call repo.delete and next', async () => {
      const error = new Error('Something went wrong');
      (repo.delete as jest.Mock).mockRejectedValue(error);
      req.params = { id: '1' };
      await controller.delete(req, res, next);
      expect(repo.delete).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
