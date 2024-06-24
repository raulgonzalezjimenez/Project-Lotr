import { type NextFunction, type Request, type Response } from 'express';
import createDebug from 'debug';

import { type WithSearchRace, type Repo } from '../repositories/type.repo';
import { BaseController } from './base.controller.js';
import {
  type Character,
  type CharacterCreateDto,
} from '../entities/character.js';
import {
  characterCreateSchema,
  characterUpdateSchema,
} from '../entities/character.schema.js';
import { type Payload } from '../services/auth.services';

const debug = createDebug('GONJI:character:controller');

export class CharacterController extends BaseController<
  Character,
  CharacterCreateDto
> {
  constructor(
    protected readonly repo: WithSearchRace<Character, CharacterCreateDto>
  ) {
    super(repo, characterCreateSchema, characterUpdateSchema);

    debug('Instantiated character controller');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    debug('Creating character');
    req.body.userId = (req.body.payload as Payload).id;
    const { payload, ...rest } = req.body as CharacterCreateDto & {
      payload: Payload;
    };
    req.body = rest;
    await super.create(req, res, next);
  }

  async getByRace(req: Request, res: Response, next: NextFunction) {
    const { race } = req.params;
    console.log(race);
    try {
      const result = await this.repo.searchForRace(race);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
