/* eslint-disable no-unused-vars */
import { Game } from '../entities/game.js';
import { GameRepo } from '../repository/game.m.repo.js';
import { Controller } from './controller.js';
import createDebug from 'debug';
const debug = createDebug('FinalProject:GameController');
export class GameController extends Controller<Game> {
  constructor(protected repo: GameRepo) {
    super();
    debug('Instantiated');
  }
}
