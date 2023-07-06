import mongoose from 'mongoose';
import { db, password, user } from '../config.js';
import createDebug from 'debug';
const debug = createDebug('FinalProject:dbConnect');

export const dbConnect = (env?: string) => {
  const finalEnv = env || process.env.NODE_ENV;
  const finalDb = finalEnv === 'test' ? db + '_Testing' : db;

  const uri = `mongodb+srv://${user}:${password}@cluster0.gsa5w92.mongodb.net/${finalDb}?retryWrites=true&w=majority`;
  debug(uri);
  return mongoose.connect(uri);
};
