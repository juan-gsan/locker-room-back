/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'src/db/db.connect.ts',
    'src/app.ts',
    'src/config.ts',
    'src/routers/user.router.ts',
    'src/routers/game.router.ts',
    'src/repository/user.m.model.ts',
    'src/repository/game.m.model.ts',
    'src/controllers/controller.ts',
    'src/services/firebase.ts',
  ],
};
