import { createAlbum } from "../../amazon";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { name } = body;
  return {
    statusCode: 201,
    body: await createAlbum(user, name),
  };
});
