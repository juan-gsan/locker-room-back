import joi from 'joi';
import { User } from './user.js';

export const userSchema = joi.object<User>({
  userName: joi.string().required(),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .required()
    .messages({
      'string.base': 'password must be type text',
      'string.empty': 'Invalid password',
    }),
});
