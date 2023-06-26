export type User = {
  id: string;
  userName: string;
  password: string;
  avatar: Avatar;
  friends: User[];
  enemies: User[];
};

export type UserLogin = {
  user: string;
  password: string;
};

type Avatar = {
  urlOriginal: string;
  url: string;
  mimetype: string;
  size: number;
};
