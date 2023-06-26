import { GameType } from '../types/game.type.js';
import { Image } from '../types/image.js';

export type SportsField = {
  id: string;
  name: string;
  gameType: GameType;
  location: string;
  picture: Image;
};
