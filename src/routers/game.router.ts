import { GameController } from '../controllers/game.controller.js';
import { Game } from '../entities/game.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { GameRepo } from '../repository/game.m.repo.js';
import { Repo } from '../repository/repo.js';
import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UserRepo } from '../repository/user.m.repo.js';
import { User } from '../entities/user.js';

const debug = createDebug('FinalProject:gameRouter');
debug('Executed');

const gameRepo: Repo<Game> = new GameRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new GameController(gameRepo, userRepo);
const interceptor = new AuthInterceptor(gameRepo);

export const gameRouter = createRouter();

gameRouter.get('/', controller.getAll.bind(controller));
gameRouter.get('/:id', controller.getById.bind(controller));
gameRouter.post(
  '/create',
  interceptor.logged.bind(interceptor),
  controller.createGame.bind(controller)
);
gameRouter.patch(
  '/join/:id',
  interceptor.logged.bind(interceptor),
  controller.joinGame.bind(controller)
);
gameRouter.patch(
  '/leave/:id',
  interceptor.logged.bind(interceptor),
  controller.leaveGame.bind(controller)
);
gameRouter.patch(
  '/edit/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedForGame.bind(interceptor),
  controller.editGame.bind(controller)
);
gameRouter.delete(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedForGame.bind(interceptor),
  controller.deleteById.bind(controller)
);
