import { type PrismaClient } from '@prisma/client';
import createDebug from 'debug';
import { HttpError } from '../middleware/errors.middleware.js';
import { type WithSearchRace, type Repo } from './type.repo.js';
import {
  type Race,
  type Character,
  type CharacterCreateDto,
} from '../entities/character.js';
const debug = createDebug('GONJI:characters:repository:sql');

const select = {
  id: true,
  name: true,
  imgUrl: true,
  description: true,
  faction: true,
  race: true,
  userId: true,
};

export class CharacterSqlRepo
  implements WithSearchRace<Character, CharacterCreateDto>
{
  constructor(private readonly prisma: PrismaClient) {
    debug('Instantiated characters sql repository');
  }

  async readAll() {
    const characters = await this.prisma.character.findMany({
      select,
    });
    return characters;
  }

  async readById(id: string) {
    const character = await this.prisma.character.findUnique({
      where: { id },
      select,
    });

    if (!character) {
      throw new HttpError(404, 'Not Found', `character ${id} not found`);
    }

    return character;
  }

  async create(data: CharacterCreateDto) {
    return this.prisma.character.create({
      data: {
        ...data,
      },
      select,
    });
  }

  async update(id: string, data: Partial<CharacterCreateDto>) {
    const character = await this.prisma.character.findUnique({
      where: { id },
      select,
    });
    if (!character) {
      throw new HttpError(404, 'Not Found', `character ${id} not found`);
    }

    return this.prisma.character.update({
      where: { id },
      data,
      select,
    });
  }

  async delete(id: string) {
    const character = await this.prisma.character.findUnique({
      where: { id },
      select,
    });
    if (!character) {
      throw new HttpError(404, 'Not Found', `character ${id} not found`);
    }

    return this.prisma.character.delete({
      where: { id },
      select,
    });
  }

  async searchForRace(race: Race) {
    console.log(race);
    const character = await this.prisma.character.findMany({
      where: { race },
      select,
    });

    if (!character) {
      throw new HttpError(404, 'Not Found', `character ${race} not found`);
    }

    return character;
  }
}
