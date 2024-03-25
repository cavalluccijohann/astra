import { CreateUserInput, publicUser, User } from "../types/User";
import prisma, { formatUser } from "../client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUserDefaultAlbum } from "./albumService";

export async function registerUser(createUserInput: CreateUserInput): Promise<publicUser> {
  const passwordHash = await bcrypt.hash(createUserInput.password, 10);
  const user = await prisma.user.create({
    data: {
      username: createUserInput.username,
      email: createUserInput.email,
      password: passwordHash,
    },
  });
  await createUserDefaultAlbum(user as User);
  return formatUser(user);
}

export async function login(email: string, password: string): Promise<{ user: User, authToken: string }> {
  const runtimeConfig = useRuntimeConfig();
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      albums: true,
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }
  const authToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    runtimeConfig.authSecret,
    { expiresIn: "30d" },
  );
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      authToken,
    },
  });
  return {
    authToken,
    user
  }
}
