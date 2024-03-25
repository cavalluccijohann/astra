import { deleteUserAlbums } from "./albumService";
import { publicUser, User } from "../types/User";
import prisma, { formatUser } from "../client";
import jwt from "jsonwebtoken";

export async function getUserByAuthToken(authToken: string): Promise<publicUser | null> {
  const runtimeConfig = useRuntimeConfig();
  const user = await prisma.user.findFirst({
    where: {
      authToken,
    },
  });
  try {
    const decodedUser = jwt.verify(authToken, runtimeConfig.authSecret) as { id: string };
    if (decodedUser.id !== user.id) return null;
  } catch (error) {
    return null;
  }
  return formatUser(user);
}

export async function updateUser(userId: string, data: { username: string }): Promise<publicUser> {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
  return formatUser(updatedUser);
}

export async function deleteUser(user: User): Promise<void> {
  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
  await deleteUserAlbums(user);
}
