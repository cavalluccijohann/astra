import aws from "@aws-sdk/client-s3";
import { User } from "./types/User";
import prisma from "./client";

const runtimeConfig = useRuntimeConfig();

const client = new aws.S3Client({
  region: runtimeConfig.awsRegion,
  credentials: {
    accessKeyId: runtimeConfig.awsAccessKeyId,
    secretAccessKey: runtimeConfig.awsSecretAccessKey,
  },
});
const publicUrl = `https://${runtimeConfig.awsBucket}.s3.${runtimeConfig.awsRegion}.amazonaws.com/`;

export async function createAlbum(user: User, name: string, isPublic: boolean, isDefault: boolean = false) {
  if (isDefault) {
    const command = new aws.PutObjectCommand({
      Bucket: runtimeConfig.awsBucket,
      Key: `${user.username}/`,
    });
    await client.send(command);
    return prisma.album.create({
      data: {
        title: name,
        isPublic: false,
        isDefault: true,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  } else {
    const command = new aws.PutObjectCommand({
      Bucket: runtimeConfig.awsBucket,
      Key: `${user.username}/${name}/`,
    });
    await client.send(command);
  }
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

export async function deleteAlbum(user: User, id: string) {
  const album = await prisma.album.findUnique({
    where: {
      id,
    },
  });
  if (!album) throw new Error("Album not found");
  if (album.userId !== user.id) throw new Error("Unauthorized");
  const command = new aws.DeleteObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.username}/${album.title}/`,
  });
  await client.send(command);
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

export async function uploadPhoto(user: User, albumId: string, file: File) {
  const album = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
  });
  if (!album) throw new Error("Album not found");
  if (album.userId !== user.id) throw new Error("Unauthorized");
  const command = new aws.PutObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.username}/${album.title}/${file.name}`,
    Body: file,
  });
  await client.send(command);
  return prisma.photo.create({
    data: {
      name: file.name,
      url: `${publicUrl}${user.username}/${album.title}/${file.name}`,
      albums: {
        connect: {
          id: albumId,
        },
      },
    },
  });

}

export async function deletePhoto(user: User, id: string) {
  const photo = await prisma.photo.findUnique({
    where: {
      id,
    },
    include: {
      albums: true,
    }
  });
  if (!photo) throw new Error("Photo not found");
  if (photo.userId !== user.id) throw new Error("Unauthorized");
  for (const album of photo.albums) {
    if (album.userId !== user.id) throw new Error("Unauthorized");
    const command = new aws.DeleteObjectCommand({
      Bucket: runtimeConfig.awsBucket,
      Key: `${user.username}/${album.title}/${photo.name}`,
    });
    await client.send(command);
  }
  return prisma.photo.delete({
    where: {
      id,
    },
  });
}

export async function deleteUserAlbums(user: User) {
  const command = new aws.DeleteObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.username}/`,
  });
  await client.send(command);
  return prisma.album.deleteMany({
    where: {
      userId: user.id,
    },
  });
}
