import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { Repo } from './repo.js';
import { UserModel } from './user.m.model.js';

export class UserRepo implements Repo<User> {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  async query(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async queryById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (result === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value }).exec();
    return result;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const newUser = await UserModel.create(data);
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const newUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (newUser === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
    return newUser;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not Found', 'Invalid Id');
  }
}
