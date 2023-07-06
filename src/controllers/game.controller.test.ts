import { Request, Response, NextFunction } from 'express';
import { GameRepo } from '../repository/game.m.repo';
import { GameController } from './game.controller';
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
    query: { offset: 1 },
  } as unknown as Request;

  const res = {
    next: 'http://localhost:9999/games?offset=2',
    prev: null,
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When it is instantiated and getAll method is called', () => {
    test('Then method query should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      const mockOffset = 1;
      const mockLimit = 4;
      req.protocol = 'http';
      req.get = jest.fn().mockReturnValue('localhost:9999');
      req.baseUrl = '/games';

      await controller.getAll(req, res, next);
      expect(mockGameRepo.query).toHaveBeenCalledWith(mockOffset, mockLimit);
      expect(mockGameRepo.count).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and getById method is called', () => {
    test('Then method queryById should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      req.params.id = '1';
      await controller.getById(req, res, next);
      expect(mockGameRepo.queryById).toHaveBeenCalledWith(req.params.id);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and createGame method is called', () => {
    test('Then method create should have been called', async () => {
      const mockToken = '12345';
      const mockOwner = { id: mockToken };
      const mockGame = {};

      const mockUserRepo = {
        queryById: jest.fn().mockResolvedValueOnce(mockOwner),
      } as unknown as UserRepo;

      const mockCreate = jest.fn().mockResolvedValueOnce(mockGame);
      const mockGameRepo = {
        create: mockCreate,
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);

      const req = {
        body: {
          tokenPayload: { id: mockToken },
          gameType: 'f5',
        },
      } as Request;

      const res = {
        send: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const next = jest.fn();

      await controller.createGame(req, res, next);

      expect(mockUserRepo.queryById).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockGame);
      expect(mockGameRepo.create).toHaveBeenCalledWith({
        owner: mockOwner,
        players: [mockOwner],
        gameType: 'f5',
        spotsLeft: 9,
        tokenPayload: { id: mockToken },
      });
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
