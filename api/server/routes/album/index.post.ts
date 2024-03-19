import { H3Event } from "h3";
import supabase from "../../supabase";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { name } = body;
  const buckets = await supabase.storage.listBuckets();
  return {
    statusCode: 201,
    body: buckets,
  };
});
