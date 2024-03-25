//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKET_NAME,
  },
});
