import { GameController } from '../controllers/game.controller.js';
import { Game } from '../entities/game.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { GameRepo } from '../repository/game.m.repo.js';
import { Repo } from '../repository/repo.js';
import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { FileMiddleware } from '../middlewares/files.js';

const debug = createDebug('FinalProject:gameRouter');
debug('Executed');

const gameRepo: Repo<Game> = new GameRepo();
const controller = new GameController(gameRepo);
const interceptor = new AuthInterceptor(gameRepo);
const fileStore = new FileMiddleware();

export const gameRouter = createRouter();

gameRouter.get('/', controller.getAll.bind(controller));
gameRouter.get('/:id', controller.getById.bind(controller));
gameRouter.post(
  '/',
  interceptor.logged.bind(interceptor),
  fileStore.singleFileStore('avatar').bind(fileStore),
  // TEMP fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.createGame.bind(controller)
);
gameRouter.patch(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedForGame.bind(interceptor),
  controller.patch.bind(controller)
);
gameRouter.delete(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedForGame.bind(interceptor),
  controller.deleteById.bind(controller)
);
