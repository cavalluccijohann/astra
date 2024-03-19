//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
  },
});
