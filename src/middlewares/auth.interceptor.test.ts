import { NextFunction, Request, Response } from 'express';
import AuthServices, { Payload } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';
import { GameRepo } from '../repository/game.m.repo';
import { HttpError } from '../types/http.error';
import { Game } from '../entities/game';
import { Image } from '../types/image';

jest.mock('../services/auth');

describe('Given an interceptor', () => {
  let next: NextFunction;
  let mockPayload;
  let req: Request;
  let mockGame: Partial<Game>;
  let res: Response;
  let mockRepo: GameRepo;
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    next = jest.fn() as NextFunction;
    mockPayload = { id: '1' } as Payload;
    req = {
      body: { tokenPayload: mockPayload },
      params: { id: '1' },
    } as unknown as Request;
    mockGame = {
      owner: {
        id: '1',
        userName: 'test',
        password: 'test',
        level: 1,
        gender: 'female',
        email: 'test',
        avatar: {} as Image,
      },
    };
    res = {} as Response;
    mockRepo = {
      queryById: jest.fn().mockResolvedValueOnce({ owner: { id: '1' } }),
    } as unknown as GameRepo;
    interceptor = new AuthInterceptor(mockRepo);
  });

  describe('When it is instantiated and logged method is called', () => {
    test('Then next should have been called', () => {
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as Payload;
      const req = { body: { tokenPayload: mockPayload } } as Request;
      const res = {} as Response;
      req.get = jest.fn().mockReturnValueOnce('Bearer valid token');
      const mockRepo: GameRepo = {} as unknown as GameRepo;
      const interceptor = new AuthInterceptor(mockRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and authorizedForGame method is called', () => {
    test('Then gameRepo.queryById should have been called', () => {
      mockRepo.queryById(mockGame.owner!.id);
      interceptor.authorizedForGame(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(mockRepo.queryById).toHaveBeenCalledWith(mockGame.owner!.id);
    });
  });

  describe('When it is instantiated and authorizedForGame method is called', () => {
    test('Then next should have been called', async () => {
      await interceptor.authorizedForGame(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe('When logged method is called but there is no authHeader', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Authorization header'
      );
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as Payload;
      const req = { body: { tokenPayload: mockPayload } } as Request;
      const res = {} as Response;
      req.get = jest.fn().mockReturnValueOnce(undefined);
      const mockRepo: GameRepo = {} as unknown as GameRepo;
      const interceptor = new AuthInterceptor(mockRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When logged method is called but the authHeader does not start with Bearer', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Bearer in Authorization header'
      );
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as Payload;
      const req = { body: { tokenPayload: mockPayload } } as Request;
      const res = {} as Response;
      req.get = jest.fn().mockReturnValueOnce('Not valid token');
      const mockRepo: GameRepo = {} as unknown as GameRepo;
      const interceptor = new AuthInterceptor(mockRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When authorizedForGames method is called but there is no tokenPayload in the request body', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );
      const next = jest.fn() as NextFunction;
      const req = {
        body: { tokenPayload: undefined },
        params: { id: '1' },
      } as unknown as Request;
      const res = {} as Response;
      const mockRepo: GameRepo = {} as unknown as GameRepo;
      const interceptor = new AuthInterceptor(mockRepo);
      interceptor.authorizedForGame(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When authorized method is called but the body id is different from the params id', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(401, 'Not authorized', 'Not authorized');

      const mockPayload = { id: '5' } as Payload;
      const req = {
        body: { tokenPayload: mockPayload },
        params: { id: '1' },
      } as unknown as Request;

      await interceptor.authorizedForGame(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
