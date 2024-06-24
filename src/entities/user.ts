import { type Character } from './character';

export type User = {
  id: string;
  email: string;
  password: string;
  userName: string;
  character: Character[];
};

export type UserCreateDto = {
  email: string;
  password: string;
  userName: string;
};
export type UserUpdateDto = Partial<UserCreateDto>;
