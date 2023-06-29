import { GameController } from '../controllers/game.controller.js';
import { Game } from '../entities/game.js';
import { User } from '../entities/user.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { FileMiddleware } from '../middlewares/files.js';
import { GameRepo } from '../repository/game.m.repo.js';
import { Repo } from '../repository/repo.js';
import { UserRepo } from '../repository/user.m.repo.js';
import { Router as createRouter } from 'express';
import createDebug from 'debug';

const debug = createDebug('FinalProject:gameRouter');
debug('Executed');

const gameRepo: Repo<Game> = new GameRepo();
const userRepo: Repo<User> = new UserRepo();
const controller = new GameController(gameRepo);
const fileStore = new FileMiddleware();
const interceptor = new AuthInterceptor(userRepo);

export const gameRouter = createRouter();

gameRouter.get('/', controller.getAll.bind(controller));
gameRouter.get('/:id', controller.getById.bind(controller));
gameRouter.post('/', controller.post.bind(controller));
gameRouter.patch('/:id', controller.patch.bind(controller));
gameRouter.delete('/:id', controller.deleteById.bind(controller));
