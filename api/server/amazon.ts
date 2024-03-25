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

export async function createAlbum(user: User, name: string, isPublic: boolean) {
  const command = new aws.PutObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.username}/${name}/`,
  });
  await client.send(command);
  return prisma.album.create({
    data: {
      title: name,
      public: isPublic,
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
      public: true,
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

export async function getBucketObjects(bucketName: string) {
  const command = new aws.ListObjectsV2Command({
    Bucket: bucketName,
  });
  return await client.send(command);
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
      url: `${publicUrl}${user.username}/${album.title}/${file.name}`,
      albums: {
        connect: {
          id: albumId,
        },
      },
    },
  });

}

/*export async function getUserAlbums(user: User) {
  const command = new aws.ListObjectsV2Command({
    Bucket: runtimeConfig.awsBucket,
    Prefix: user.username,
  });
  const albumsResponse = await client.send(command);
  /!*return await Promise.all(
    filteredAlbums?.map(async (album) => {
      const objectCommand = new aws.GetObjectCommand({
        Bucket: runtimeConfig.awsBucket,
        Key: album.Key,
      });
      const object = await client.send(objectCommand);
      return {
        Key: album.Key,
        LastModified: object.LastModified,
        Size: object.ContentLength,
        ContentType: object.ContentType,
        Url: `${ publicUrl }${ album.Key }`,
      };
    }) ?? []
  );*!/
  // return like [{ name: "album1", images: [{ name: "image1", url: "https://..." }] }]
const formattedAlbums = await Promise.all(
  albumsResponse?.Contents.map(async (album) => {
      const albumName = album.Key.split("/")[1];
      const albumCommand = new aws.ListObjectsV2Command({
        Bucket: runtimeConfig.awsBucket,
        Prefix: album.Key,
      });
      const albumResponse = await client.send(albumCommand);
      return {
        name: albumName,
        images: await Promise.all(
          albumResponse?.Contents?.map(async (image) => {
            const imageCommand = new aws.GetObjectCommand({
              Bucket: runtimeConfig.awsBucket,
              Key: image.Key,
            });
            const object = await client.send(imageCommand);
            return {
              name: image.Key.split("/")[2],
              size: object.ContentLength,
              contentType: object.ContentType,
              url: `${ publicUrl }${ image.Key }`,
            };
          }) ?? []
        ),
      };
    }) ?? []
  );
  // remove duplicates
  return formattedAlbums.filter((album, index, self) => self.findIndex(a => a.name === album.name) === index);
}*/
