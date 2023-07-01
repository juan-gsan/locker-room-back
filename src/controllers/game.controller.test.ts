// Import { Request, Response, NextFunction } from 'express';
// import { GameRepo } from '../repository/game.m.repo';
// import { GameController } from './game.controller';
// // TEMP import { HttpError } from '../types/http.error';

// jest.mock('../middlewares/auth.interceptor');

// describe('Given a game controller', () => {
//   const mockRepo: GameRepo = {
//     query: jest.fn().mockResolvedValueOnce([]),
//     queryById: jest.fn().mockResolvedValueOnce({}),
//     search: jest.fn().mockResolvedValue([]),
//     create: jest.fn().mockResolvedValue({}),
//     update: jest.fn().mockResolvedValueOnce({}),
//     delete: jest.fn().mockResolvedValueOnce(null),
//   } as unknown as GameRepo;

//   const req = {
//     body: {},
//     params: {},
//   } as unknown as Request;

//   const res = {
//     send: jest.fn(),
//     status: jest.fn(),
//   } as unknown as Response;

//   const next = jest.fn() as NextFunction;

//   describe('When it is instantiated and getAll method is called', () => {
//     test('Then method query should have been called', async () => {
//       const controller = new GameController(mockRepo);
//       await controller.getAll(req, res, next);
//       expect(res.send).toHaveBeenCalled();
//       expect(mockRepo.query).toHaveBeenCalled();
//     });
//   });

//   describe('When it is instantiated and getById method is called', () => {
//     test('Then method queryById should have been called', async () => {
//       const controller = new GameController(mockRepo);
//       req.params.id = '1';
//       await controller.getById(req, res, next);
//       expect(mockRepo.queryById).toHaveBeenCalled();
//       expect(res.send).toHaveBeenCalled();
//     });
//   });

//   describe('When it is instantiated and post method is called', () => {
//     test('Then method create should have been called', async () => {
//       const controller = new GameController(mockRepo);
//       req.body = { id: '1' };
//       await controller.post(req, res, next);
//       expect(mockRepo.create).toHaveBeenCalled();
//       expect(res.send).toHaveBeenCalled();
//     });
//   });

//   describe('When it is instantiated and patch method is called', () => {
//     test('Then method update should have been called', async () => {
//       const controller = new GameController(mockRepo);
//       req.body = { id: '1' };
//       req.params.id = '1';
//       await controller.patch(req, res, next);
//       expect(mockRepo.update).toHaveBeenCalled();
//       expect(res.send).toHaveBeenCalled();
//     });
//   });

//   describe('When it is instantiated and deleteById method is called', () => {
//     test('Then method delete should have been called', async () => {
//       const controller = new GameController(mockRepo);
//       req.params.id = '1';
//       await controller.deleteById(req, res, next);
//       expect(mockRepo.delete).toHaveBeenCalled();
//       expect(res.send).toHaveBeenCalled();
//     });
//   });
// });

// // TEMP edescribe('Given a game controller', () => {
// //   const req = {
// //     body: {},
// //   } as unknown as Request;

// //   const res = {
// //     send: jest.fn(),
// //     status: jest.fn(),
// //   } as unknown as Response;

// //   const next = jest.fn() as NextFunction;

// //   describe('When it is instantiated and getById method is called but password is not valid', () => {
// //     test('Then it should throw an error', async () => {
// //       const error = new Error('Illegal arguments: undefined, number');
// //       const mockRepo: GameRepo = {
// //         query: jest.fn().mockRejectedValueOnce(error),
// //         queryById: jest.fn().mockRejectedValueOnce(error),
// //         search: jest.fn().mockRejectedValueOnce(error),
// //         create: jest.fn().mockRejectedValueOnce(error),
// //         update: jest.fn().mockRejectedValueOnce(error),
// //         delete: jest.fn().mockRejectedValueOnce(error),
// //       } as unknown as GameRepo;
// //       const controller = new GameController(mockRepo);
// //       await controller.getAll(req, res, next);
// //       expect(next).toHaveBeenCalledWith(error);
// //     });
// //   });
// //   describe('When it is instantiated and getById method is called but there is no user or password', () => {
// //     test('Then it should throw an error', async () => {
// //       const error = new HttpError(400, 'Bad request', 'Invalid User/Password');
// //       const mockRepo: GameRepo = {
// //         query: jest.fn().mockRejectedValueOnce(error),
// //         queryById: jest.fn().mockRejectedValueOnce(error),
// //         search: jest.fn().mockRejectedValueOnce(error),
// //         create: jest.fn().mockRejectedValueOnce(error),
// //         update: jest.fn().mockRejectedValueOnce(error),
// //         delete: jest.fn().mockRejectedValueOnce(error),
// //       } as unknown as GameRepo;
// //       req.body = { user: null, password: null };
// //       const controller = new GameController(mockRepo);
// //       await controller.login(req, res, next);
// //       expect(next).toHaveBeenCalledWith(error);
// //     });
// //   });
// //   describe('When it is instantiated and login method is called but user or password is not valid', () => {
// //     test('Then it should throw an error', async () => {
// //       const error = new HttpError(400, 'Bad request', 'Invalid User/Password');
// //       const mockRepo: GameRepo = {
// //         query: jest.fn().mockRejectedValueOnce(error),
// //         queryById: jest.fn().mockRejectedValueOnce(error),
// //         search: jest.fn().mockRejectedValueOnce(error),
// //         create: jest.fn().mockRejectedValueOnce(error),
// //         update: jest.fn().mockRejectedValueOnce(error),
// //         delete: jest.fn().mockRejectedValueOnce(error),
// //       } as unknown as GameRepo;
// //       const controller = new GameController(mockRepo);
// //       req.body = { user: 'test', password: 'test' };
// //       await controller.login(req, res, next);
// //       expect(next).toHaveBeenCalledWith(error);
// //     });
// //   });
// //   describe('When it is instantiated and login method is called but userIsValid is false', () => {
// //     test('Then it should throw an error', async () => {
// //       const error = new HttpError(400, 'Bad request', 'Invalid User/Password');
// //       const mockRepo: GameRepo = {
// //         query: jest.fn().mockRejectedValueOnce(error),
// //         queryById: jest.fn().mockRejectedValueOnce(error),
// //         search: jest.fn().mockRejectedValueOnce(error),
// //         create: jest.fn().mockRejectedValueOnce(error),
// //         update: jest.fn().mockRejectedValueOnce(error),
// //         delete: jest.fn().mockRejectedValueOnce(error),
// //       } as unknown as GameRepo;
// //       const controller = new GameController(mockRepo);
// //       await controller.login(req, res, next);
// //       expect(next).toHaveBeenCalledWith(error);
// //     });
// //   });
// // });
