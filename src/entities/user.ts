import { Gender } from '../types/gender.js';
import { Level } from '../types/level.js';
import { Image } from '../types/image.js';
import { Game } from './game.js';

export type User = {
  id: string;
  userName: string;
  email: string;
  password: string;
  avatar: Image;
  gender: Gender;
  level: Level;
  games: Game[];
};
