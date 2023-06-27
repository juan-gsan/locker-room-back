import { User } from '../entities/user';
import { HttpError } from '../types/http.error';
import { UserModel } from './user.m.model';
import { UserRepo } from './user.m.repo';

jest.mock('./user.m.model.js');
describe('Given a UserRepo', () => {
  describe('When it is instantiated and query method is called', () => {
    test('Then UserModel.find should have been called', async () => {
      const repo = new UserRepo();
      const exec = jest.fn().mockResolvedValueOnce([]);
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.query();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  describe('When it is instantiated and queryById method is called', () => {
    test('Then UserModel.findById should have been called', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const exec = jest.fn().mockResolvedValueOnce({});
      UserModel.findById = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.queryById(mockId);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When it is instantiated and search method is called', () => {
    test('Then UserModel.find should have been called', async () => {
      const repo = new UserRepo();
      const mockParams = { key: '', value: '' };
      const exec = jest.fn().mockResolvedValueOnce({});
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.search(mockParams);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When it is instantiated and create method is called', () => {
    test('Then UserModel.create should have been called', async () => {
      const repo = new UserRepo();
      const mockUser = {} as Omit<User, 'id'>;
      UserModel.create = jest.fn().mockResolvedValueOnce({});
      const result = await repo.create(mockUser);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When it is instantiated and update method is called', () => {
    test('Then UserModel.findByIdAndUpdate should have been called', async () => {
      const repo = new UserRepo();
      const mockUser = {} as Partial<User>;
      const mockId = '';
      const exec = jest.fn().mockResolvedValueOnce({});
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.update(mockId, mockUser);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When it is instantiated and delete method is called', () => {
    test('Then UserModel.findByIdAndDelete should have been called', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const exec = jest.fn();
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({ exec });
      await repo.delete(mockId);
      expect(exec).toHaveBeenCalled();
    });
  });
  describe('When it is instantiated and queryById method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findById = jest.fn().mockReturnValueOnce({ exec });
      await expect(repo.queryById(mockId)).rejects.toThrow(error);
    });
  });
  describe('When it is instantiated and update method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const mockUser = {} as Partial<User>;
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({ exec });
      await expect(repo.update(mockId, mockUser)).rejects.toThrow(error);
    });
  });
  describe('When it is instantiated and delete method is called but id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new UserRepo();
      const mockId = '';
      const error = new HttpError(404, 'Not Found', 'Invalid Id');
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({ exec });
      await expect(repo.delete(mockId)).rejects.toThrow(error);
    });
  });
});
