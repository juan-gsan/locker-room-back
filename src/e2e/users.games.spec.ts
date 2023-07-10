/* eslint-disable no-unused-vars */
import request from 'supertest';
import mongoose from 'mongoose';
import AuthServices, { Payload } from '../services/auth';
import { UserModel } from '../repository/user.m.model';
import { GameModel } from '../repository/game.m.model';
import { dbConnect } from '../db/db.connect';
import { Game } from '../entities/game';
import { SportsField } from '../types/sports.field';
import { app } from '../app';

const setUsersList = async () => {
  const mockUsers = [
    {
      userName: 'Ragno',
      email: 'ragno@supertest.com',
      password: await AuthServices.hash('12345'),
      avatar: {},
      gender: 'mixed',
      level: 1,
    },
    {
      userName: 'Ternavsky',
      email: 'ternavsky@supertest.com',
      password: await AuthServices.hash('12345'),
      avatar: {},
      gender: 'mixed',
      level: 1,
    },
  ];

  await UserModel.deleteMany().exec();
  await UserModel.insertMany(mockUsers);

  const userData = await UserModel.find().exec();
  const mockUserIds = [userData[0].id, userData[1].id];

  return mockUserIds;
};

const setGamesList = async () => {
  const mockGames = [
    {
      gameType: 'f7',
      schedule: new Date('2020-01-01') as Date,
      level: 1,
      gender: 'female',
      spotsLeft: 5,
      location: {},
    },
    {
      gameType: 'f11',
      schedule: new Date('2020-01-07') as unknown as Date,
      level: 4,
      gender: 'mixed',
      spotsLeft: 12,
      location: {},
    },
  ];

  await GameModel.deleteMany().exec();
  await GameModel.insertMany(mockGames);

  const gameData = await GameModel.find().exec();
  const mockGameIds = [gameData[0].id, gameData[1].id];

  return mockGameIds;
};

describe('Given the app with /user path and connected to MongoDB', () => {
  let tokenPayloadFirstUser: Payload;
  let tokenPayloadSecondUser: Payload;
  let mockTokenPayloadFirstUser: string;
  let mockTokenPayloadSecondUser: string;
  let mockFirstGameId: string;
  let mockSecondGameId: string;
  beforeAll(async () => {
    await dbConnect();

    const mockUserIds: string[] = await setUsersList();

    tokenPayloadFirstUser = {
      id: mockUserIds[0],
      userName: 'Ragno',
    };

    mockTokenPayloadFirstUser = AuthServices.createJWT(tokenPayloadFirstUser);

    tokenPayloadSecondUser = {
      id: mockUserIds[1],
      userName: 'Ternavsky',
    };

    mockTokenPayloadSecondUser = AuthServices.createJWT(tokenPayloadSecondUser);

    const mockGameIds: string[] = await setGamesList();
    mockFirstGameId = mockGameIds[0];
    mockSecondGameId = mockGameIds[1];
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const mockGamePayload: Partial<Game> = {
    gameType: 'f11',
    schedule: new Date('2020-01-01') as Date,
    level: 4,
    gender: 'mixed',
    spotsLeft: 12,
    location: {} as SportsField,
  };

  const userLogin = async () => {
    const mockUserLogin = {
      user: 'Ragno',
      password: '12345',
    };

    await request(app).patch('/user/login').send(mockUserLogin);
  };

  describe('When the post method to /user/register path is called', () => {
    test('Then if the payload is not valid, the status code should be 406', async () => {
      const mockRegister = {
        email: 'lanza@supertest.com',
      };

      const response = await request(app)
        .post('/user/register')
        .send(mockRegister);

      expect(response.status).toBe(406);
    });
  });

  describe('When patch method to user/login path is called', () => {
    test('Then if the payload is Ok, the status code should be 200', async () => {
      const mockLogin = {
        user: 'Ternavsky',
        password: '12345',
      };

      const response = await request(app).patch('/user/login').send(mockLogin);

      expect(response.status).toBe(200);
    });

    test('Then if the payload is not Ok (missing password), the status code should be 400', async () => {
      const mockLogin = {
        user: 'Ragno',
      };

      const response = await request(app).patch('/user/login').send(mockLogin);

      expect(response.status).toBe(400);
    });

    test('Then if the payload is not Ok (invalid user), the status code should be 400', async () => {
      const mockLogin = {
        user: 'Marco',
      };

      const response = await request(app).patch('/user/login').send(mockLogin);

      expect(response.status).toBe(400);
    });

    test('Then if the payload is not Ok (invalid password), the status code should be 400', async () => {
      const mockLogin = {
        user: 'Ternavsky',
        password: '0000',
      };

      const response = await request(app).patch('/user/login').send(mockLogin);

      expect(response.status).toBe(400);
    });
  });

  describe('When get method to user/:id is called', () => {
    test('Then if the payload is Ok, the status code should be 200', async () => {
      userLogin();

      const mockUrl = `/user/${tokenPayloadFirstUser.id}`;

      const response = await request(app).get(mockUrl);

      expect(response.status).toBe(200);
    });

    test('Then if the payload is not Ok (invalid id), the status code should be 500', async () => {
      userLogin();

      const mockUrl = '/user/000000';

      const response = await request(app).get(mockUrl);

      expect(response.status).toBe(500);
    });
  });

  describe('When get method to game/ is called', () => {
    test('Then if the payload is Ok, the status code should be 200', async () => {
      userLogin();

      const mockUrl = '/game/';

      const response = await request(app).get(mockUrl);

      expect(response.status).toBe(200);
    });

    test('Then if the payload is Ok with query, the status code should be 200', async () => {
      const mockUrl = '/game?offset=2';

      const response = await request(app).get(mockUrl);

      expect(response.status).toBe(200);
    });
  });

  describe('When get method to game/:id path is called', () => {
    test('Then if the payload is Ok, the status code should be 200', async () => {
      userLogin();

      const mockUrl = `/game/${mockFirstGameId}`;

      const response = await request(app).get(mockUrl);

      expect(response.status).toBe(200);
    });

    test('Then if the payload is not Ok, the status code should be 500', async () => {
      userLogin();

      const mockUrl = '/game/00000';

      const response = await request(app).get(mockUrl);

      expect(response.status).toBe(500);
    });
  });
});
