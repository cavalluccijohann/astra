import { awsClient } from "../amazon";
import { User } from "../types/User";
import aws from "@aws-sdk/client-s3";
import prisma from "../client";

const runtimeConfig = useRuntimeConfig();

export async function createAlbum(user: User, name: string, isPublic: boolean) {
  const command = new aws.PutObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.id}/${name}/`,
  });
  await awsClient.send(command);
  return prisma.album.create({
    data: {
      title: name,
      isPublic: isPublic,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
}

export async function createUserDefaultAlbum(user: User) {
  const command = new aws.PutObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.id}/`,
  });
  await awsClient.send(command);
  return prisma.album.create({
    data: {
      title: `${user.username}'s Album`,
      isPublic: false,
      isDefault: true,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
}

export async function deleteAlbum(user: User, id: string) {
  const album = await prisma.album.findUnique({
    where: {
      id,
    },
  });
  if (!album) throw new Error("Album not found");
  if (album.userId !== user.id || album.isDefault) throw new Error("Unauthorized");
  const command = new aws.DeleteObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.id}/${album.title}/`,
  });
  await awsClient.send(command);
  return prisma.album.delete({
    where: {
      id,
    },
  });
}

export async function getAlbum(user: User, id: string) {
  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    include: {
      photos: true,
    }
  });
  if (!album) throw new Error("Album not found");
  return album;
}

export async function getPublicAlbums() {
  return prisma.album.findMany({
    where: {
      isPublic: true,
    },
    include: {
      photos: true,
      user: {
        select: {
          username: true,
        },
      }
    }
  });
}

export async function getUserAlbums(user: User) {
  return prisma.album.findMany({
    where: {
      userId: user.id,
    },
    include: {
      photos: true,
    }
  });
}

export async function deleteUserAlbums(user: User) {
  const command = new aws.DeleteObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.id}/`,
  });
  await awsClient.send(command);
  return prisma.album.deleteMany({
    where: {
      userId: user.id,
    },
  });
}
