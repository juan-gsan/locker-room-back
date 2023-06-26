import http from 'http';
import { app } from './app.js';
import * as dotenv from 'dotenv';
import createDebug from 'debug';
import { dbConnect } from './db/db.connect.js';

const debug = createDebug('W7CH5');

dotenv.config();
const PORT = process.env.PORT || 2222;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to db: ' + mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  debug('Listening on PORT ' + PORT);
});

server.on('error', (error) => {
  debug(error.message);
});
