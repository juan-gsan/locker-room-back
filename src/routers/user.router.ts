import { UserController } from '../controllers/user.controller.js';
import { User } from '../entities/user.js';
import { FileMiddleware } from '../middlewares/files.js';
import { Validation } from '../middlewares/validation.js';
import { Repo } from '../repository/repo.js';
import { UserRepo } from '../repository/user.m.repo.js';
import { Router as createRouter } from 'express';
import createDebug from 'debug';

const debug = createDebug('FinalProject:userRouter');
debug('Executed');

const repo: Repo<User> = new UserRepo();
const controller = new UserController(repo);
const fileStore = new FileMiddleware();
const validation = new Validation();
export const userRouter = createRouter();

userRouter.get('/', controller.getAll.bind(controller));
userRouter.get('/:id', controller.getById.bind(controller));
userRouter.post(
  '/register',
  fileStore.singleFileStore('avatar').bind(fileStore),
  validation.registerValidation().bind(validation),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.register.bind(controller)
);
userRouter.patch('/login', controller.login.bind(controller));
