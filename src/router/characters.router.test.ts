import { type CharacterController } from '../controller/characters.controller';
import { type AuthInterceptor } from '../middleware/auth.interceptor';
import { type FilesInterceptor } from '../middleware/files.interceptor';
import { type CharacterSqlRepo } from '../repositories/characters.sql.repo';
import { CharacterRouter } from './characters.router';

describe('Given a instance of the class CharacterRouter', () => {
  const controller = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByRace: jest.fn(),
  } as unknown as CharacterController;

  const authInterceptor = {
    authentication: jest.fn(),
    authorization: jest.fn().mockReturnValue(jest.fn()),
  } as unknown as AuthInterceptor;

  const characterSqlRepo = {} as unknown as CharacterSqlRepo;

  const filesInterceptor = {
    singleFile: jest.fn().mockReturnValue(jest.fn()),
    cloudinaryUpload: jest.fn(),
  } as unknown as FilesInterceptor;

  const router = new CharacterRouter(
    controller,
    authInterceptor,
    characterSqlRepo,
    filesInterceptor
  );

  test('Then it should be instance of the class', () => {
    expect(router).toBeInstanceOf(CharacterRouter);
  });
});
