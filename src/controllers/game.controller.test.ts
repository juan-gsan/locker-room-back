import { Request, Response, NextFunction } from 'express';
import { GameRepo } from '../repository/game.m.repo';
import { GameController } from './game.controller';
import { UserRepo } from '../repository/user.m.repo';
import { HttpError } from '../types/http.error';
import { Game } from '../entities/game';

jest.mock('../middlewares/auth.interceptor');

let mockGameRepo: GameRepo;
let mockUserRepo: UserRepo;
let req: Request;
let res: Response;
let next: NextFunction;
let count: number;
let limit: number;
let mockToken: string;
let mockGame: {};
let newPlayer: {};
let currentGameData = {
  players: [
    { id: '1', userName: 'Fratini' },
    { id: '2', userName: 'Nitin' },
  ],
} as unknown as Game;
let updatedGameData: {};

describe('Given a game controller', () => {
  beforeEach(() => {
    newPlayer = { id: '1' };
    currentGameData = { id: '5', players: [], spotsLeft: 2 } as unknown as Game;
    updatedGameData = { id: '5', players: [newPlayer], spotsLeft: 1 };
    mockToken = '12345';
    mockGame = {};
    limit = 4;
    count = 10;
    mockGameRepo = {
      query: jest.fn().mockResolvedValueOnce([]),
      queryById: jest.fn().mockResolvedValueOnce({ id: mockToken }),
      count: jest.fn().mockResolvedValueOnce(count),
      search: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue(mockGame),
      update: jest.fn().mockResolvedValueOnce({}),
      delete: jest.fn().mockResolvedValueOnce(null),
    } as unknown as GameRepo;

    mockUserRepo = {
      query: jest.fn().mockResolvedValueOnce([]),
      queryById: jest.fn().mockResolvedValueOnce({}),
      search: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValueOnce({}),
      delete: jest.fn().mockResolvedValueOnce(null),
    } as unknown as UserRepo;

    req = {
      tokenPayload: { id: mockToken },
      query: { offset: 1 },
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:9999'),
      baseUrl: '/game',
      body: {},
      params: {},
    } as unknown as Request;

    res = {
      next: 'http://localhost:9999/games?offset=2',
      prev: null,
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    next = jest.fn() as NextFunction;
  });
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

    test('Then it should set response.next when offset is less than count / limit', async () => {
      const offset = 2;
      const expectedNext = 'http://localhost:9999/game?offset=3';

      req.query = { offset: '2' };

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.getAll(req, res, next);

      expect(mockGameRepo.query).toHaveBeenCalledWith(offset, limit);
      expect(mockGameRepo.count).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ next: expectedNext })
      );
    });
    test('Then it should set response.prev when offset is greater than 1', async () => {
      const offset = 2;

      req.query.offset = '2';
      const expectedPrev = 'http://localhost:9999/game?offset=1';

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.getAll(req, res, next);

      expect(mockGameRepo.query).toHaveBeenCalledWith(offset, limit);
      expect(mockGameRepo.count).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ prev: expectedPrev })
      );
    });
    test('Then it should set offset to 1 when req.query.offset is not defined', async () => {
      req.query = { offset: {} };

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.getAll(req, res, next);

      expect(mockGameRepo.query).toHaveBeenCalledWith(1, limit);
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
    test('Then method create should have been called with f5', async () => {
      req.body.tokenPayload = { id: mockToken };

      const controller = new GameController(mockGameRepo, mockUserRepo);

      req.body.gameType = 'f5';

      await controller.createGame(req, res, next);

      expect(mockUserRepo.queryById).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockGame);
      expect(mockGameRepo.create).toHaveBeenCalledWith({
        owner: {},
        players: [{}],
        gameType: 'f5',
        spotsLeft: 9,
        tokenPayload: { id: mockToken },
      });
    });
    test('Then method create should have been called with f7', async () => {
      req.body.tokenPayload = { id: mockToken };
      const controller = new GameController(mockGameRepo, mockUserRepo);

      req.body.gameType = 'f7';

      await controller.createGame(req, res, next);

      expect(mockUserRepo.queryById).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockGame);
      expect(mockGameRepo.create).toHaveBeenCalledWith({
        owner: {},
        players: [{}],
        gameType: 'f7',
        spotsLeft: 13,
        tokenPayload: { id: mockToken },
      });
    });
    test('Then method create should have been called with f11', async () => {
      req.body.tokenPayload = { id: mockToken };
      const controller = new GameController(mockGameRepo, mockUserRepo);

      req.body.gameType = 'f11';

      await controller.createGame(req, res, next);

      expect(mockUserRepo.queryById).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockGame);
      expect(mockGameRepo.create).toHaveBeenCalledWith({
        owner: {},
        players: [{}],
        gameType: 'f11',
        spotsLeft: 21,
        tokenPayload: { id: mockToken },
      });
    });
  });

  describe('When it is instantiated and joinGame method is called', () => {
    test('Then method update should have been called', async () => {
      mockUserRepo.queryById = jest.fn().mockResolvedValue(newPlayer);
      mockGameRepo.queryById = jest.fn().mockResolvedValue(currentGameData);
      mockGameRepo.update = jest.fn().mockResolvedValue(updatedGameData);

      req.body.tokenPayload = { id: '1' };
      req.body.params = { id: '5' };

      const controller = new GameController(mockGameRepo, mockUserRepo);

      await controller.joinGame(req, res, next);
      expect(mockUserRepo.queryById).toHaveBeenCalledWith('1');
      expect(mockGameRepo.update).toHaveBeenCalledWith(req.params.id, req.body);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and leaveGame method is called', () => {
    test('Then method update should have been called', async () => {
      currentGameData = {
        players: [{ id: '1' }, { id: '5' }],
      } as unknown as Game;

      mockUserRepo.queryById = jest.fn().mockResolvedValue(newPlayer);
      mockGameRepo.queryById = jest.fn().mockResolvedValue(currentGameData);
      mockGameRepo.update = jest.fn().mockResolvedValue(updatedGameData);
      req.body.tokenPayload = { id: '1' };
      req.body.params = { id: '5' };

      const controller = new GameController(mockGameRepo, mockUserRepo);

      await controller.leaveGame(req, res, next);
      expect(mockUserRepo.queryById).toHaveBeenCalledWith('1');
      expect(mockGameRepo.update).toHaveBeenCalledWith(req.params.id, req.body);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and editGame method is called', () => {
    test('Then method update should have been called', async () => {
      const controller = new GameController(mockGameRepo, mockUserRepo);
      mockUserRepo.queryById = jest.fn().mockResolvedValue(newPlayer);
      mockGameRepo.queryById = jest.fn().mockResolvedValue(currentGameData);
      mockGameRepo.update = jest.fn().mockResolvedValue(updatedGameData);

      req.body.tokenPayload = { id: '1' };
      req.body.params = { id: '5' };

      await controller.editGame(req, res, next);

      expect(mockGameRepo.update).toHaveBeenCalledWith(req.params.id, req.body);
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

describe('Given a Game controller', () => {
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

  describe('When it is instantiated and getAll method is called but is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockUserRepo: UserRepo = {
        search: jest.fn().mockRejectedValue(error),
        create: jest.fn().mockRejectedValue(error),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        query: jest.fn().mockRejectedValue(error),
        count: jest.fn().mockRejectedValue(error),
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and getById method is called but is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockUserRepo: UserRepo = {} as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        queryById: jest.fn().mockRejectedValue(error),
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.getById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and createGame method is called but is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockRejectedValue(error),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        create: jest.fn().mockRejectedValue(error),
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.createGame(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and createGame method is called but owner is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(404, 'Owner not found', 'Owner not found');
      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockResolvedValue(null),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        create: jest.fn(),
      } as unknown as GameRepo;
      const req = {
        body: {
          tokenPayload: {
            id: null,
          },
          gameType: 'f5',
        },
      } as unknown as Request;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.createGame(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and editGame method is called but is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockRejectedValue(error),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        update: jest.fn().mockRejectedValue(error),
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.editGame(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and joinGame method is called but is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockRejectedValue(error),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        update: jest.fn().mockRejectedValue(error),
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.joinGame(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and joinGame method is called but user is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(
        404,
        'New Player not found',
        'New Player not found'
      );

      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockResolvedValue(null),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {} as unknown as GameRepo;

      const req = {
        body: {
          tokenPayload: {
            id: null,
          },
          gameType: 'f5',
        },
      } as unknown as Request;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.joinGame(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and leaveGame method is called but is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockRejectedValue(error),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        update: jest.fn().mockRejectedValue(error),
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.leaveGame(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and leaveGame method is called but user is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(
        404,
        'New Player not found',
        'New Player not found'
      );

      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockResolvedValue(null),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {} as unknown as GameRepo;

      const req = {
        body: {
          tokenPayload: {
            id: null,
          },
          gameType: 'f5',
        },
      } as unknown as Request;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.leaveGame(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated and deleteById method is called but is not valid', () => {
    test('Then it should throw an error', async () => {
      const error = new Error('Illegal arguments: undefined, number');
      const mockUserRepo: UserRepo = {
        queryById: jest.fn().mockRejectedValue(error),
      } as unknown as UserRepo;
      const mockGameRepo: GameRepo = {
        delete: jest.fn().mockRejectedValue(error),
      } as unknown as GameRepo;

      const controller = new GameController(mockGameRepo, mockUserRepo);
      await controller.deleteById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
