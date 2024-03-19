import { createClient } from "@supabase/supabase-js";

const runtimeConfig = useRuntimeConfig();

const supabase = createClient(
  runtimeConfig.supabaseUrl,
  runtimeConfig.supabaseKey
);

export default supabase;
