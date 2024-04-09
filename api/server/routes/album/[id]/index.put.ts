import { toggleAlbumPrivacy } from "../../../app/albumService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const albumId = getRouterParam(event, "id");
  await toggleAlbumPrivacy(user, albumId);
  return { status: 200 };
});
