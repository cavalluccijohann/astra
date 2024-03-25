import { awsClient, publicUrl } from "../amazon";
import aws from "@aws-sdk/client-s3";
import { User } from "../types/User";
import prisma from "../client";

const runtimeConfig = useRuntimeConfig();

export async function uploadPhoto(user: User, file: File) {
  const album = await prisma.album.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
  });
  if (!album) throw new Error("Album not found");
  if (album.userId !== user.id) throw new Error("Unauthorized");
  const command = new aws.PutObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.id}/${file.name}`,
    Body: file,
  });
  await awsClient.send(command);
  return prisma.photo.create({
    data: {
      name: file.name,
      url: `${publicUrl}${user.id}/${file.name}`,
      albums: {
        connect: {
          id: album.id,
        },
      },
      user: {
        connect: {
          id: user.id,
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
      Key: `${user.id}/${album.title}/${photo.name}`,
    });
    await awsClient.send(command);
  }
  return prisma.photo.delete({
    where: {
      id,
    },
  });
}
