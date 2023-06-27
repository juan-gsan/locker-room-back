import { beforeEach } from 'node:test';
import { User } from '../entities/user';
import { UserModel } from './user.m.model';
import { UserRepo } from './user.m.repo';
import { Repo } from './repo';

jest.mock('./user.m.model.js');
describe('Given a UserRepo class', () => {
  let repo: Repo<User>;
  beforeEach(() => {
    repo = new UserRepo();
  });

  describe('When it is instantiated and query method is called', () => {
    test.only('Then UserModel.find should have been called', async () => {
      const exec = jest.fn().mockResolvedValueOnce([]);
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.query();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  describe('When it is instantiated and create method is called', () => {
    test('Then UserModel.create should have been called', async () => {
      const mockData = {} as Omit<User, 'id'>;
      UserModel.create = jest.fn().mockResolvedValueOnce({} as User);
      const result = await repo.create(mockData);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({} as User);
    });
  });

  describe('When it is instantiated and search method is called', () => {
    test('Then UserModel.search should have been called', async () => {
      const mockData = {} as { key: string; value: string };
      const exec = jest.fn().mockResolvedValueOnce([] as User[]);
      UserModel.find = jest.fn().mockReturnValueOnce({ exec });
      const result = await repo.search(mockData);
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
