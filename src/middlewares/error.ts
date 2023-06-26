import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http.error.js';
import mongoose, { mongo } from 'mongoose';
import { NitinError } from '../types/nitin.error.js';
import { ValidationError } from 'express-validation';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof HttpError) {
    console.error(error.status, error.statusMessage, error.message);
    res.status(error.status);
    res.statusMessage = error.message;
    res.send({
      status: error.status + ' ' + error.statusMessage,
    });
    return;
  }

  if (error instanceof NitinError) {
    console.error(error.status, error.statusMessage, error.message);
    res.status(error.status);
    res.statusMessage = error.message;
    res.send({
      status: error.status + ' ' + error.statusMessage,
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    console.error('400 Bad request', error.message);
    res.status(400);
    res.statusMessage = 'Bad Request';
    res.send({
      status: '400 Bad request',
    });
    return;
  }

  if (error instanceof mongo.MongoServerError) {
    console.error('406 Not accepted', error.message);
    res.status(406);
    res.statusMessage = 'Not accepted';
    res.send({
      status: '406 Not accepted',
    });
    return;
  }

  if (error instanceof ValidationError) {
    console.error(error.statusCode, error.message);
    res.status(error.statusCode);
    res.statusMessage = error.error;
    res.send({
      status: error.statusCode + ' ' + error.error,
    });
    return;
  }

  console.error(error);
  res.status(500);
  res.send({
    error: error.message,
  });
};
