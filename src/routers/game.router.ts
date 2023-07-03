import { GameController } from '../controllers/game.controller.js';
import { Game } from '../entities/game.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { GameRepo } from '../repository/game.m.repo.js';
import { Repo } from '../repository/repo.js';
import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UserRepo } from '../repository/user.m.repo.js';
import { User } from '../entities/user.js';
import { FileMiddleware } from '../middlewares/files.js';

const debug = createDebug('FinalProject:gameRouter');
debug('Executed');

const gameRepo: Repo<Game> = new GameRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new GameController(gameRepo, userRepo);
const interceptor = new AuthInterceptor(gameRepo);
const fileStore = new FileMiddleware();

export const gameRouter = createRouter();

gameRouter.get('/', controller.getAll.bind(controller));
gameRouter.get('/:id', controller.getById.bind(controller));
gameRouter.post(
  '/create',
  fileStore.singleFileStore('avatar').bind(fileStore),
  interceptor.logged.bind(interceptor),
  // TEMP fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.createGame.bind(controller)
);
gameRouter.patch(
  '/:id',
  interceptor.logged.bind(interceptor),
  controller.joinGame.bind(controller)
);
gameRouter.patch(
  '/edit/:id',
  interceptor.authorizedForGame.bind(interceptor),
  interceptor.logged.bind(interceptor),
  controller.patch.bind(controller)
);
gameRouter.delete(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedForGame.bind(interceptor),
  controller.deleteById.bind(controller)
);
