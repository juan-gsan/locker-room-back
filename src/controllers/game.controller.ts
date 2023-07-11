/* Eslinrt-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { GameRepo } from '../repository/game.m.repo.js';
import createDebug from 'debug';
import { UserRepo } from '../repository/user.m.repo.js';
import { HttpError } from '../types/http.error.js';
import { ApiResponse } from '../types/response.api.js';
import { Game } from '../entities/game.js';
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
      const filter = req.query.filter as string;
      let items: Game[] = [];
      let next = null;
      let prev = null;
      let baseUrl = '';

      if (filter) {
        items = await this.gameRepo.query(offset, limit, filter);
        const totalCount = await this.gameRepo.count(filter);
        const totalPages = Math.ceil(totalCount / limit);
        baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

        if (offset < totalPages) {
          next = `${baseUrl}?filter=${filter}?offset=${offset + 1}`;
        }

        if (offset > 1) {
          prev = `${baseUrl}?filter=${filter}?offset=${offset - 1}`;
        }

        const response: ApiResponse = {
          items,
          next,
          prev,
          count: await this.gameRepo.count(filter),
        };

        res.status(200);
        res.send(response);
      } else {
        items = await this.gameRepo.query(offset, limit);
        const totalCount = await this.gameRepo.count();
        const totalPages = Math.ceil(totalCount / limit);

        baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

        if (offset < totalPages) {
          next = `${baseUrl}?offset=${offset + 1}`;
        }

        if (offset > 1) {
          prev = `${baseUrl}?offset=${offset - 1}`;
        }

        const response: ApiResponse = {
          items,
          next,
          prev,
          count: await this.gameRepo.count(),
        };

        res.status(200);
        res.send(response);
      }
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

      if (req.body.gameType === 'f5') {
        req.body.spotsLeft = 9;
      }

      if (req.body.gameType === 'f7') {
        req.body.spotsLeft = 13;
      }

      if (req.body.gameType === 'f11') {
        req.body.spotsLeft = 21;
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

  async editGame(req: Request, res: Response, next: NextFunction) {
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
      currentGameData.spotsLeft -= 1;
      req.body = currentGameData;

      res.status(202);
      res.send(await this.gameRepo.update(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  }

  async leaveGame(req: Request, res: Response, next: NextFunction) {
    try {
      debug(req.body.tokenPayload);
      const newPlayer = await this.userRepo.queryById(req.body.tokenPayload.id);
      if (!newPlayer) {
        throw new HttpError(
          404,
          'New Player not found',
          'New Player not found'
        );
      }

      const currentGameData = await this.gameRepo.queryById(req.params.id);
      currentGameData.players = currentGameData.players.filter(
        (player) => player.id !== req.body.tokenPayload.id
      );
      currentGameData.spotsLeft += 1;
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
