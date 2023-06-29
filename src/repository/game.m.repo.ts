import { Game } from '../entities/game.js';
import { HttpError } from '../types/http.error.js';
import { GameModel } from './game.m.model.js';
import { Repo } from './repo.js';

export class GameRepo implements Repo<Game> {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  async query(): Promise<Game[]> {
    const result = await GameModel.find().exec();
    return result;
  }

  async queryById(id: string): Promise<Game> {
    const result = await GameModel.findById(id).exec();
    if (result === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Game[]> {
    const result = await GameModel.find({ [key]: value }).exec();
    return result;
  }

  async create(data: Omit<Game, 'id'>): Promise<Game> {
    const newUser = await GameModel.create(data);
    return newUser;
  }

  async update(id: string, data: Partial<Game>): Promise<Game> {
    const newUser = await GameModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (newUser === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
    return newUser;
  }

  async delete(id: string): Promise<void> {
    const result = await GameModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
  }
}
