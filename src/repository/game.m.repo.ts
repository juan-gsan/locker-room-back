import { Game } from '../entities/game.js';
import { HttpError } from '../types/http.error.js';
import { GameModel } from './game.m.model.js';
import { Repo } from './repo.js';

export class GameRepo implements Repo<Game> {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  async query(offset = 1, limit = 2): Promise<Game[]> {
    offset = parseInt(offset as any, 10);
    limit = parseInt(limit as any, 10);
    const result = await GameModel.find()
      .skip((offset - 1) * limit)
      .limit(limit)
      .populate('owner')
      .populate('players')
      .exec();
    return result;
  }

  async count(): Promise<number> {
    return GameModel.countDocuments().exec();
  }

  async queryById(id: string): Promise<Game> {
    const result = await GameModel.findById(id)
      .populate('owner')
      .populate('players')
      .exec();
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
    const result = await GameModel.find({ [key]: value })
      .populate('owner')
      .populate('players')
      .exec();
    return result;
  }

  async create(data: Omit<Game, 'id'>): Promise<Game> {
    const newGame = await GameModel.create(data);
    return newGame;
  }

  async update(id: string, data: Partial<Game>): Promise<Game> {
    const newGame = await GameModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate('owner')
      .populate('players')
      .exec();
    if (newGame === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
    return newGame;
  }

  async delete(id: string): Promise<void> {
    const result = await GameModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
  }
}
