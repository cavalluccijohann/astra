import { Album } from "@prisma/client";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  authToken: string;
  albums: Album[];
};

export type publicUser = {
  id: string;
  username: string;
  email: string;
  albums?: Album[];
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};
