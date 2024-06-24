import { type PrismaClient } from '@prisma/client';
import { HttpError } from '../middleware/errors.middleware';
import { CharacterSqlRepo } from './characters.sql.repo';
import { type CharacterCreateDto } from '../entities/character';

const mockPrisma = {
  character: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({ id: '1' }),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
} as unknown as PrismaClient;

describe('Given a instance of the class CharacterSqlRepo', () => {
  const repo = new CharacterSqlRepo(mockPrisma);

  test('Then it should be instance of the class', () => {
    expect(repo).toBeInstanceOf(CharacterSqlRepo);
  });

  describe('When we use the method readAll', () => {
    test('Then it should call prisma.findMany', async () => {
      const result = await repo.readAll();
      expect(mockPrisma.character.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the method readById with a valid ID', () => {
    test('Then it should call prisma.findUnique', async () => {
      const result = await repo.readById('1');
      expect(mockPrisma.character.findUnique).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('When we use the method readById with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.character.findUnique as jest.Mock).mockResolvedValueOnce(
        null
      );
      await expect(repo.readById('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'character 2 not found')
      );
    });
  });

  describe('When we use the method create', () => {
    test('Then it should call prisma.create', async () => {
      const data = {} as unknown as CharacterCreateDto;
      const result = await repo.create(data);
      expect(mockPrisma.character.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with a valid ID', () => {
    test('Then it should call prisma.update', async () => {
      const result = await repo.update('1', {});
      expect(mockPrisma.character.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.character.findUnique as jest.Mock).mockResolvedValueOnce(
        null
      );
      await expect(repo.update('2', {})).rejects.toThrow(
        new HttpError(404, 'Not Found', 'character 2 not found')
      );
    });
  });

  describe('When we use the method delete with a valid ID', () => {
    test('Then it should call prisma.delete', async () => {
      const result = await repo.delete('1');
      expect(mockPrisma.character.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method delete with an invalid ID', () => {
    test('Then it should throw an error', async () => {
      (mockPrisma.character.findUnique as jest.Mock).mockResolvedValueOnce(
        null
      );
      await expect(repo.delete('2')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'character 2 not found')
      );
    });
  });
});
