import { Request, Response, NextFunction } from 'express';
import { GameRepo } from '../repository/game.m.repo';
import { GameController } from './game.controller';
import { HttpError } from '../types/http.error';
import { UserRepo } from '../repository/user.m.repo';

jest.mock('../middlewares/auth.interceptor');

describe('Given a game controller', () => {
  const mockGameRepo: GameRepo = {
    query: jest.fn().mockResolvedValueOnce([]),
    queryById: jest.fn().mockResolvedValueOnce({}),
    count: jest.fn().mockResolvedValueOnce(0),
    search: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValueOnce({}),
    delete: jest.fn().mockResolvedValueOnce(null),
  } as unknown as GameRepo;

  const mockUserRepo: UserRepo = {
    query: jest.fn().mockResolvedValueOnce([]),
    queryById: jest.fn().mockResolvedValueOnce({}),
    search: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValueOnce({}),
    delete: jest.fn().mockResolvedValueOnce(null),
  } as unknown as UserRepo;

  const req = {
    body: {},
    params: {},
  } as unknown as Request;

  const res = {
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When it is instantiated and getAll method is called', () => {
    test('Then method query should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.getAll(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockGameRepo.query).toHaveBeenCalled();
      expect(mockGameRepo.count).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and getById method is called', () => {
    test('Then method queryById should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      req.params.id = '1';
      await controller.getById(req, res, next);
      expect(mockGameRepo.queryById).toHaveBeenCalledWith();
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and createGame method is called', () => {
    test('Then method create should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      req.body = { id: '1' };
      await controller.createGame(req, res, next);
      expect(mockGameRepo.create).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and editGame method is called', () => {
    test('Then method update should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      req.body = { id: '1' };
      req.params.id = '1';
      await controller.editGame(req, res, next);
      expect(mockGameRepo.update).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and joinGame method is called', () => {
    test('Then method update should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      req.body = { id: '1' };
      req.params.id = '1';
      await controller.joinGame(req, res, next);
      expect(mockGameRepo.update).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and deleteById method is called', () => {
    test('Then method delete should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      req.params.id = '1';
      await controller.deleteById(req, res, next);
      expect(mockGameRepo.delete).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });
  });
});

describe('Given a game controller', () => {
  const req = {
    body: {},
  } as unknown as Request;

  const res = {
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When it is instantiated and getById method is called but password is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockGameRepo: GameRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        count: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as GameRepo;

      const mockUserRepo: UserRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as UserRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When it is instantiated and getById method is called but there is no user or password', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(400, 'Bad request', 'Invalid User/Password');
      const mockGameRepo: GameRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        count: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as GameRepo;

      const mockUserRepo: UserRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as UserRepo;
      req.body = { user: null, password: null };
      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.login(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When it is instantiated and login method is called but user or password is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(400, 'Bad request', 'Invalid User/Password');
      const mockGameRepo: GameRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        count: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as GameRepo;

      const mockUserRepo: UserRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as UserRepo;
      const controller = new GameController(mockGameRepo, mockUserRepo);
      req.body = { user: 'test', password: 'test' };
      await controller.login(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When it is instantiated and getAll method is called but there is an error', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(400, 'Bad request', 'Invalid User/Password');
      const mockGameRepo: GameRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        count: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as GameRepo;

      const mockUserRepo: UserRepo = {
        query: jest.fn().mockRejectedValueOnce(error),
        queryById: jest.fn().mockRejectedValueOnce(error),
        search: jest.fn().mockRejectedValueOnce(error),
        create: jest.fn().mockRejectedValueOnce(error),
        update: jest.fn().mockRejectedValueOnce(error),
        delete: jest.fn().mockRejectedValueOnce(error),
      } as unknown as UserRepo;
      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.login(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
