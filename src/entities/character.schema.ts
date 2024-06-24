import joy from 'joi';
import { type CharacterCreateDto } from './character';

export const characterCreateSchema = joy.object<CharacterCreateDto>({
  name: joy.string().required(),
  imgUrl: joy.string().required(),
  description: joy.string().required(),
  faction: joy.string().required(),
  userId: joy.string().required(),
  race: joy.string().required(),
});
export const characterUpdateSchema = joy.object<Partial<CharacterCreateDto>>({
  name: joy.string(),
  imgUrl: joy.string(),
  description: joy.string(),
  faction: joy.string(),
  userId: joy.string(),
  race: joy.string(),
});
