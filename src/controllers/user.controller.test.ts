import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user.m.repo';
import { UserController } from './user.controller';

describe('Given a user controller', () => {
  const mockRepo: UserRepo = {
    search: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
  } as unknown as UserRepo;

  const req = {
    body: {},
  } as unknown as Request;

  const res = {
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When it is instantiated and register method is called', () => {
    test('Then method register should have been called', async () => {
      const controller = new UserController(mockRepo);
      req.body = { user: 'test', passwd: 'test' };
      await controller.register(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and login method is called', () => {
    test('Then method login should have been called', async () => {
      const controller = new UserController(mockRepo);
      req.body = { user: 'test', passwd: 'test' };
      await controller.login(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.search).toHaveBeenCalled();
    });
  });
});

describe('Given a user controller', () => {
  const error = new Error('Test');
  const mockRepo: UserRepo = {
    search: jest.fn().mockRejectedValue(error),
    create: jest.fn().mockRejectedValue(error),
  } as unknown as UserRepo;

  const req = {
    body: { user: '', passwd: '' },
  } as unknown as Request;

  const res = {
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;
  const controller = new UserController(mockRepo);
  describe('When it is instantiated and register method is called but password is not valid', () => {
    test('Then it should throw an error', async () => {
      await controller.register(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
