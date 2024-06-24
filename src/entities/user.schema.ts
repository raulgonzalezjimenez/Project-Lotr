import joy from 'joi';
import { type UserCreateDto } from './user';

export const userCreateSchema = joy.object<UserCreateDto>({
  email: joy.string().email().required(),
  password: joy.string().min(4).required(),
  userName: joy.string().min(3).required(),
});
export const userUpdateSchema = joy.object<UserCreateDto>({
  email: joy.string().email(),
  password: joy.string().min(4),
  userName: joy.string().min(3),
});
