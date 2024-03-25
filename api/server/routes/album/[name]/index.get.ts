import { getBucketObjects } from "../../../amazon";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const name = getRouterParam(event, "name");
  const objects = await getBucketObjects(name);
  return {
    statusCode: 201,
    body: objects,
  };
});
