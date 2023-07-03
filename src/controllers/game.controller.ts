/* Eslinrt-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { GameRepo } from '../repository/game.m.repo.js';
import createDebug from 'debug';
import { UserRepo } from '../repository/user.m.repo.js';
import { HttpError } from '../types/http.error.js';
import { ApiResponse } from '../types/response.api.js';
const debug = createDebug('FinalProject:GameController');

export class GameController {
  // eslint-disable-next-line no-unused-vars
  constructor(protected gameRepo: GameRepo, protected userRepo: UserRepo) {
    debug('Instantiated');
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const offset = parseInt(req.query.offset as string, 10) || 1;
      const limit = 4;

      const items = await this.gameRepo.query(offset, limit);
      const count = await this.gameRepo.count();

      const response: ApiResponse = {
        items,
        next: null,
        prev: null,
        count: items.length,
      };

      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      if (offset < count / limit) {
        response.next = `${baseUrl}?offset=${offset + 1}`;
      }

      if (offset > 1) {
        response.prev = `${baseUrl}?offset=${offset - 1}`;
      }

      console.log(response);
      res.status(200);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200);
      res.send(await this.gameRepo.queryById(req.params.id));
    } catch (error) {
      next(error);
    }
  }

  async createGame(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = await this.userRepo.queryById(req.body.tokenPayload.id);
      if (!owner) {
        throw new HttpError(404, 'Owner not found', 'Owner not found');
      }

      req.body.owner = owner;
      req.body.players = [];
      req.body.players.push(owner);

      res.status(201);
      res.send(await this.gameRepo.create(req.body));
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(202);
      res.send(await this.gameRepo.update(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  }

  async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      const newPlayer = await this.userRepo.queryById(req.body.tokenPayload.id);
      if (!newPlayer) {
        throw new HttpError(
          404,
          'New Player not found',
          'New Player not found'
        );
      }

      const currentGameData = await this.gameRepo.queryById(req.params.id);

      currentGameData.players.push(newPlayer);
      req.body = currentGameData;

      res.status(202);
      res.send(await this.gameRepo.update(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(204);
      res.send(await this.gameRepo.delete(req.params.id));
    } catch (error) {
      next(error);
    }
  }
}
