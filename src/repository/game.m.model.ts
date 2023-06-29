import { Schema, model } from 'mongoose';
import { Game } from '../entities/game.js';

const gameSchema = new Schema<Game>({
  gameType: {
    type: String,
    required: true,
  },
  schedule: {
    type: Date,
    required: true,
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  spotsLeft: {
    type: Number,
  },
  location: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

gameSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const GameModel = model('Game', gameSchema, 'games');
