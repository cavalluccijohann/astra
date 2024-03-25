import type { StreamingBlobPayloadInputTypes } from "@smithy/types";
import { awsClient, publicUrl } from "../amazon";
import aws from "@aws-sdk/client-s3";
import { User } from "../types/User";
import prisma from "../client";

const runtimeConfig = useRuntimeConfig();

export async function uploadPhoto(user: User, image: File) {
  const album = await prisma.album.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
  });
  if (!album) throw new Error("Album not found");
  if (album.userId !== user.id) throw new Error("Unauthorized");
  const photo = await image.arrayBuffer() as StreamingBlobPayloadInputTypes;
  const command = new aws.PutObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.id}/${image.name}`,
    Body: photo,
  });
  await awsClient.send(command);
  return prisma.photo.create({
    data: {
      name: image.name,
      type: image.type,
      url: `${publicUrl}${user.id}/${image.name}`,
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

export function checkPhoto(photo: File) {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  const fileType = photo.type;
  if (!allowedFileTypes.includes(fileType)) {
    throw new Error("File type not allowed");
  }
  const fileSize = photo.size;
  if (fileSize > 15 * 1024 * 1024) {
    throw new Error("File size too large");
  }
  return true;
}
