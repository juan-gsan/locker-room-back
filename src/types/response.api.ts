import { User } from '../entities/user.js';

export type ApiResponse = {
  count: number;
  next: string | null;
  prev: string | null;
  items: { [key: string]: unknown }[];
};

export type LoginResponse = {
  token: string;
  user: User;
};
