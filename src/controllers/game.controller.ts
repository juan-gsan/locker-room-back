/* Eslinrt-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { Game } from '../entities/game.js';
import { GameRepo } from '../repository/game.m.repo.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
const debug = createDebug('FinalProject:GameController');

export class GameController extends Controller<Game> {
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: GameRepo) {
    super();
    debug('Instantiated');
  }

  async createGame(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      res.status(201);
      res.send(await this.repo.create(req.body));
    } catch (error) {
      next(error);
    }
  }
}
