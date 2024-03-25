import aws from "@aws-sdk/client-s3";

const runtimeConfig = useRuntimeConfig();

export const awsClient = new aws.S3Client({
  region: runtimeConfig.awsRegion,
  credentials: {
    accessKeyId: runtimeConfig.awsAccessKeyId,
    secretAccessKey: runtimeConfig.awsSecretAccessKey,
  },
});

export const publicUrl = `https://${runtimeConfig.awsBucket}.s3.${runtimeConfig.awsRegion}.amazonaws.com/`;
