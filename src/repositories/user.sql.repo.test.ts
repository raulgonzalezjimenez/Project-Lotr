import { type PrismaClient } from '@prisma/client';
import { UsersSqlRepo } from './users.sql.repo.js';
import { HttpError } from '../middleware/errors.middleware';
import { type UserCreateDto } from '../entities/user';

const mockPrisma = {
  user: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({ id: '1' }),
    findFirst: jest.fn().mockResolvedValue({ id: '1' }),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
} as unknown as PrismaClient;
describe('Given a instance of the class UsersSqlRepo', () => {
  const repo = new UsersSqlRepo(mockPrisma);

  test('Then it should be instance of the class', () => {
    expect(repo).toBeInstanceOf(UsersSqlRepo);
  });

  describe('When we use the method readAll', () => {
    test('Then it should call prisma.findMany', async () => {
      const result = await repo.readAll();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the method readById with a valid ID', () => {
    test('Then it should call prisma.findUnique', async () => {
      const result = await repo.readById('1');
      expect(mockPrisma.user.findUnique).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When we use the method readById with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.readById('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'User 2 not found')
      );
    });
  });

  describe('When we use the method searchForLogin with a valid key', () => {
    test('Then it should call prisma.findFirst', async () => {
      const result = await repo.searchForLogin('email', 'test@sample.com');
      expect(mockPrisma.user.findFirst).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When we use the method searchForLogin with an invalid key', () => {
    test('Then it should throw an error', async () => {
      await expect(
        repo.searchForLogin('invalid' as 'name', 'test')
      ).rejects.toThrow(
        new HttpError(400, 'Bad Request', 'Invalid query parameters')
      );
    });
  });

  describe('When we use the method searchForLogin with an invalid value', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.searchForLogin('email', 'test')).rejects.toThrow(
        new HttpError(400, 'Bad Request', 'Invalid email or password')
      );
    });
  });

  describe('When we use the method create', () => {
    test('Then it should call prisma.create', async () => {
      const data = {} as unknown as UserCreateDto;
      const result = await repo.create(data);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with a valid ID', () => {
    test('Then it should call prisma.update', async () => {
      const result = await repo.update('1', {});
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.update('2', {})).rejects.toThrow(
        new HttpError(404, 'Not Found', 'User 2 not found')
      );
    });
  });

  describe('When we use the method delete with a valid ID', () => {
    test('Then it should call prisma.delete', async () => {
      const result = await repo.delete('1');
      expect(mockPrisma.user.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method delete with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.delete('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'User 2 not found')
      );
    });
  });
});
