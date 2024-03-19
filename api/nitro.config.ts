//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  },
});
