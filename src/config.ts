import * as dotenv from 'dotenv';
dotenv.config();

export const user = process.env.DB_USER;
export const password = process.env.DB_PASSWORD;
export const db = process.env.DB_NAME;
export const secret = process.env.JWT_SECRET;

export const firebaseConfig = {
  apiKey: 'AIzaSyDfQTwm5EPQ0FyqK4ho4423dZj-mYjZ8xo',
  authDomain: 'w7ch5-e7d0e.firebaseapp.com',
  projectId: 'w7ch5-e7d0e',
  storageBucket: 'w7ch5-e7d0e.appspot.com',
  messagingSenderId: '280404924862',
  appId: '1:280404924862:web:544026cd9816a7eefb81ef',
};
