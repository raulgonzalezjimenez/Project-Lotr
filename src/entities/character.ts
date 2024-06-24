export type Character = {
  id: string;
  name: string;
  imgUrl: string;
  description: string;
  faction: string;
  race: Race;
  userId: string;
};
export type CharacterCreateDto = {
  name: string;
  imgUrl: string;
  description: string;
  faction: string;
  race: Race;
  userId: string;
};
export type Race = 'men' | 'elve' | 'dwarf' | 'urukhai' | 'orc' | 'hobbit';
export type CharacterUpdateDto = Partial<CharacterCreateDto>;
