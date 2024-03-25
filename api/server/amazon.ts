import aws from "@aws-sdk/client-s3";
import { User } from "./types/User";

const runtimeConfig = useRuntimeConfig();

const client = new aws.S3Client({
  region: runtimeConfig.awsRegion,
  credentials: {
    accessKeyId: runtimeConfig.awsAccessKeyId,
    secretAccessKey: runtimeConfig.awsSecretAccessKey,
  },
});

export async function createAlbum(user: User, name: string) {
  const command = new aws.PutObjectCommand({
    Bucket: runtimeConfig.awsBucket,
    Key: `${user.username}/${name}/`,
  });
  return await client.send(command);
}

export async function getPublicAlbums() {
  const command = new aws.ListObjectsV2Command({
    Bucket: runtimeConfig.awsBucket,
  });
  return await client.send(command);
}

export async function getBucketObjects(bucketName: string) {
  const command = new aws.ListObjectsV2Command({
    Bucket: bucketName,
  });
  return await client.send(command);
}

export async function getUserAlbums(user: User) {
  const command = new aws.ListObjectsV2Command({
    Bucket: runtimeConfig.awsBucket,
    Prefix: user.username,
  });
  const albumsResponse = await client.send(command);
  // return all files with there respective album (include the public url for preview)
  return albumsResponse.Contents.map((album) => ({
    name: album.Key,
    url: `https://${runtimeConfig.awsBucket}.s3.${runtimeConfig.awsRegion}.amazonaws.com/${album.Key}`,
  }));
}
