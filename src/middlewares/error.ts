import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http.error.js';
import mongoose, { mongo } from 'mongoose';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof HttpError) {
    res.status(error.status);
    res.statusMessage = error.message;
    res.send({
      status: error.status + ' ' + error.statusMessage,
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400);
    res.statusMessage = 'Bad Request';
    res.send({
      status: '400 Bad request',
    });
    return;
  }

  if (error instanceof mongo.MongoServerError) {
    res.status(406);
    res.statusMessage = 'Not accepted';
    res.send({
      status: '406 Not accepted',
    });
    return;
  }

  res.status(500);
  res.send({
    error: error.message,
  });
};
