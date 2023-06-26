import createDebug from 'debug';
import { validate } from 'express-validation';
import { userSchema } from '../entities/user.joi.js';
const debug = createDebug('W7CH5:ValidationMiddleware');

export class Validation {
  constructor() {
    debug('Instantiated');
  }

  registerValidation() {
    return validate(
      {
        body: userSchema,
      },
      { statusCode: 406 },
      { abortEarly: false }
    );
  }
}
