import { getUserAlbums } from "../../../app/albumService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  return {
    status: 200,
    content: await getUserAlbums(user)
  }
});
