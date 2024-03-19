export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  authToken: string;
};

export type publicUser = {
  id: string;
  username: string;
  email: string;
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};
