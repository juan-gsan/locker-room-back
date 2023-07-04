import { Payload } from '../services/auth.js';
import { GameType } from '../types/game.type.js';
import { Gender } from '../types/gender.js';
import { Image } from '../types/image.js';
import { Level } from '../types/level.js';
import { SportsField } from '../types/sports.field.js';
import { User } from './user.js';

export type Game = {
  id: string;
  gameType: GameType;
  schedule: Date;
  level: Level;
  gender: Gender;
  spotsLeft: number;
  location: SportsField;
  avatar: Image;
  owner: User;
  players: Partial<User>[];
  tokenPayload: Payload;
};
