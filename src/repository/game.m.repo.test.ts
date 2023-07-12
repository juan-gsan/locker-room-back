import { Game } from '../entities/game';
import { HttpError } from '../types/http.error';
import { GameModel } from './game.m.model';
import { GameRepo } from './game.m.repo';

jest.mock('./game.m.model.js');

describe('Given a GameRepo', () => {
  describe('When it is instantiated and query method is called without filter', () => {
    test('Then GameModel.find should have been called', async () => {
      const repo = new GameRepo();
      const exec = jest.fn().mockResolvedValueOnce([]);
      const populate = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockReturnValueOnce({ exec }) });
      const limit = jest.fn().mockReturnValue({ populate });
      const skip = jest.fn().mockReturnValue({ limit });
      GameModel.find = jest.fn().mockReturnValueOnce({ skip });
      const result = await repo.query();

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When it is instantiated and query method is called with filter', () => {
    test('Then GameModel.find should have been called', async () => {
      const repo = new GameRepo();
      const exec = jest.fn().mockResolvedValueOnce([]);
      const mockQuery = { gameType: 'f5' };
      const populate = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockReturnValueOnce({ exec }) });
      const limit = jest.fn().mockReturnValue({ populate });
      const skip = jest.fn().mockReturnValue({ limit });
      GameModel.find = jest.fn().mockReturnValueOnce({ skip });
      const result = await repo.query(1, 4, mockQuery.gameType);

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When it is instantiated and count method is called', () => {
    test('Then GameModel.countDocuments should have been called', async () => {
      const repo = new GameRepo();
      const mockQuery = { gameType: 'f7' };
      const exec = jest.fn().mockResolvedValueOnce(0);
      GameModel.countDocuments = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.count(mockQuery.gameType);

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(0);
    });
  });

  describe('When it is instantiated and queryById method is called', () => {
    test('Then GameModel.findById should have been called', async () => {
      const repo = new GameRepo();
      const mockId = '';
      const exec = jest.fn().mockResolvedValueOnce({});
      GameModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({ exec }),
        }),
      });
      const result = await repo.queryById(mockId);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When it is instantiated and search method is called', () => {
    test('Then GameModel.find should have been called', async () => {
      const repo = new GameRepo();
      const mockParams = { key: '', value: '' };
      const exec = jest.fn().mockResolvedValueOnce({});
      GameModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({ exec }),
        }),
      });
      const result = await repo.search(mockParams);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When it is instantiated and create method is called', () => {
    test('Then GameModel.create should have been called', async () => {
      const repo = new GameRepo();
      const mockUser = {} as Omit<Game, 'id'>;
      GameModel.create = jest.fn().mockResolvedValueOnce({});
      const result = await repo.create(mockUser);
      expect(GameModel.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When it is instantiated and update method is called', () => {
    test('Then GameModel.findByIdAndUpdate should have been called', async () => {
      const repo = new GameRepo();
      const mockUser = {} as Partial<Game>;
      const mockId = '';
      const exec = jest.fn().mockResolvedValueOnce({});
      GameModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({ exec }),
        }),
      });
      const result = await repo.update(mockId, mockUser);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When it is instantiated and delete method is called', () => {
    test('Then GameModel.findByIdAndDelete should have been called', async () => {
      const repo = new GameRepo();
      const mockId = '';
      const exec = jest.fn();
      GameModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({ exec });
      await repo.delete(mockId);
      expect(exec).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and queryById method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new GameRepo();
      const mockId = '';
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      GameModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({ exec }),
        }),
      });

      await expect(repo.queryById(mockId)).rejects.toThrow(error);
    });
  });

  describe('When it is instantiated and update method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new GameRepo();
      const mockId = '';
      const mockUser = {} as Partial<Game>;
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      GameModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({ exec }),
        }),
      });
      await expect(repo.update(mockId, mockUser)).rejects.toThrow(error);
    });
  });

  describe('When it is instantiated and delete method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new GameRepo();
      const mockId = '';
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      GameModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({ exec });
      await expect(repo.delete(mockId)).rejects.toThrow(error);
    });
  });
});
