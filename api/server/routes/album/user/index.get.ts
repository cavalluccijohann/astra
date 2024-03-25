import { getUserAlbums } from "../../../amazon";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  return {
    statusCode: 201,
    body: await getUserAlbums(user),
  };
});
