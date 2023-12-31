import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { errorHandler } from './middlewares/error.js';
import { userRouter } from './routers/user.router.js';
import { gameRouter } from './routers/game.router.js';

const debug = createDebug('FinalProject:App');

export const app = express();

debug('Start Express App');

const corsOptions = { origin: '*' };

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.set('trust proxy', true);

app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Content-Security-Policy', 'upgrade-insecure-requests;');
  next();
});

app.get('/', (req, res, next) => {
  res.send('Welcome to the Express App!');
  next();
});

app.use('/user', userRouter);
app.use('/game', gameRouter);

app.use(errorHandler);
