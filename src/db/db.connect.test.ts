import { dbConnect } from './db.connect';
import mongoose from 'mongoose';

describe('Given dbConnect function', () => {
  describe('When NODE_ENV === test', () => {
    test('Then it should be a connection to testing db', async () => {
      const result = await dbConnect();
      expect(typeof result).toBe(typeof mongoose);
      expect(mongoose.connection.db.databaseName).toContain('Testing');
      mongoose.disconnect();
    });
  });
  describe('When NODE_ENV !== test', () => {
    test('Then it should be a connection to testing db', async () => {
      const result = await dbConnect('dev');
      expect(typeof result).toBe(typeof mongoose);
      expect(mongoose.connection.db.databaseName).not.toContain('Testing');
      mongoose.disconnect();
    });
  });
});
