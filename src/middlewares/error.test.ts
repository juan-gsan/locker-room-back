import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error';
import { errorHandler } from './error';
import mongoose, { mongo } from 'mongoose';

describe('Given an errorHandler function', () => {
  describe('When it receives an instance of HttpError', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockResolvedValueOnce(666),
      send: jest
        .fn()
        .mockResolvedValueOnce({ error: 'Test Error', status: 666 }),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    test('Then it should return an error message', () => {
      const mockError = new HttpError(666, 'Test Error', 'Test Error');
      errorHandler(mockError, req, res, next);
      expect(res.send).toHaveBeenCalledWith({
        status: '666 Test Error',
      });
    });
  });
  describe('When it receives an instance of Error', () => {
    const mockError = new Error('Test Error');

    const req = {} as Request;
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    test('Then it should return an error message', () => {
      errorHandler(mockError, req, res, next);
      expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
  describe('When it receives an instance of ValidationError', () => {
    const mockError = new mongoose.Error.ValidationError();

    const req = {} as Request;
    const res = {
      status: jest.fn().mockResolvedValueOnce(400),
      send: jest.fn().mockResolvedValueOnce('400 Bad request'),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    test('Then it should throw an error', () => {
      errorHandler(mockError, req, res, next);
      expect(res.send).toHaveBeenCalledWith({ status: '400 Bad request' });
    });
  });
  describe('When it receives an instance of MongoServerError', () => {
    const mockErrorMessage = {};
    const mockError = new mongo.MongoServerError(mockErrorMessage);
    const req = {} as Request;
    const res = {
      status: jest.fn().mockResolvedValueOnce(406),
      send: jest.fn().mockResolvedValueOnce('406 Not accepted'),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    test('Then it should throw an error', () => {
      errorHandler(mockError, req, res, next);
      expect(res.send).toHaveBeenCalledWith({
        status: '406 Not accepted',
      });
    });
  });
});
