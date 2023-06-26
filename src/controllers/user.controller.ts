import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.m.repo.js';
import { HttpError } from '../types/http.error.js';
import AuthServices, { Payload } from '../services/auth.js';
import { User } from '../entities/user.js';
import { Controller } from './controller.js';
import { LoginResponse } from '../types/response.api.js';
import { NitinError } from '../types/nitin.error.js';

export class UserController extends Controller<User> {
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: UserRepo) {
    super();
  }

  async addFriendOrEnemy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as Payload;
      const user = await this.repo.queryById(userId);
      delete req.body.tokenPayload;
      const newUser = await this.repo.queryById(req.params.id);

      if (req.path.includes('friend')) {
        if (userId === '648dba25de1720b446f1dd93')
          throw new NitinError(409, 'Conflict', 'Nitin cannot add friends');
        user.friends.push(newUser);
        await this.repo.update(userId, user);
        await this.repo.update(req.params.id, newUser);
        res.status(201);
        res.send(user);
      }

      if (req.path.includes('enemies')) {
        user.enemies.push(newUser);
        await this.repo.update(userId, user);
        await this.repo.update(req.params.id, newUser);
        res.status(201);
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  }

  async removeFriendOrEnemy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as Payload;
      const user = await this.repo.queryById(userId);
      delete req.body.tokenPayload;
      const userToDelete = await this.repo.queryById(req.params.id);
      if (req.path.includes('friends')) {
        const userIndex = user.friends.findIndex(
          (item) => item.id === userToDelete.id
        );
        user.friends.splice(userIndex, 1);
        await this.repo.update(userId, user);
        await this.repo.update(req.params.id, userToDelete);
        res.status(201);
        res.send(user);
      }

      if (req.path.includes('enemies')) {
        const userIndex = user.enemies.findIndex(
          (item) => item.id === userToDelete.id
        );
        user.enemies.splice(userIndex, 1);
        await this.repo.update(userId, user);
        await this.repo.update(req.params.id, userToDelete);
        res.status(201);
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.user || !req.body.password) {
        throw new HttpError(400, 'Bad request', 'Invalid User/Password');
      }

      const password = await AuthServices.hash(req.body.password);
      req.body.password = password;
      res.status(201);
      res.send(await this.repo.create(req.body));
    } catch (error) {
      next(error);
    }
  }

  private async validateLogin(req: Request) {
    if (!req.body.user || !req.body.password) {
      throw new HttpError(400, 'Bad request', 'Invalid User/Password');
    }

    const data = await this.repo.search({
      key: 'userName',
      value: req.body.user,
    });

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

    return data;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.validateLogin(req);

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
