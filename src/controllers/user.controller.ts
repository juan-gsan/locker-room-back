/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.m.repo.js';
import { HttpError } from '../types/http.error.js';
import AuthServices, { Payload } from '../services/auth.js';
import { User } from '../entities/user.js';
import { Controller } from './controller.js';
import { ApiResponse, LoginResponse } from '../types/response.api.js';
import createDebug from 'debug';
const debug = createDebug('FinalProject:UserController');

export class UserController extends Controller<User> {
  constructor(protected userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.userRepo.query();
      const response: ApiResponse = {
        items,
        page: 1,
        count: items.length,
      };
      res.status(200);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200);
      res.send(await this.userRepo.queryById(req.params.id));
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const password = await AuthServices.hash(req.body.password);
      req.body.password = password;
      res.status(201);
      res.send(await this.userRepo.create(req.body));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.user || !req.body.password) {
        throw new HttpError(400, 'Bad request', 'Invalid User/Password');
      }

      let data = await this.userRepo.search({
        key: 'userName',
        value: req.body.user,
      });
      if (!data.length) {
        data = await this.userRepo.search({
          key: 'email',
          value: req.body.user,
        });
      }

      if (!data.length) {
        throw new HttpError(400, 'Bad request', 'Invalid User/Password');
      }

      const isUserValid = await AuthServices.compare(
        req.body.password,
        data[0].password
      );

      if (!isUserValid) {
        throw new HttpError(400, 'Bad request', 'Invalid User/Password');
      }

      const payload: Payload = {
        id: data[0].id,
        userName: data[0].userName,
      };
      const token = AuthServices.createJWT(payload);
      const response: LoginResponse = {
        token,
        user: data[0],
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
