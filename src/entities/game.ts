import { GameType } from '../types/game.type.js';
import { Gender } from '../types/gender.js';
import { Level } from '../types/level.js';
import { SportsField } from './sports.field.js';
import { User } from './user.js';

export type Game = {
  id: string;
  gameType: GameType;
  schedule: Date;
  level: Level;
  gender: Gender;
  spotsLeft: number;
  location: SportsField;
  owner: User;
  players: User[];
};
