import { toggleAlbumPrivacy } from "../../../app/albumService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const photoId = getRouterParam(event, "id");
  await toggleAlbumPrivacy(user, photoId);
});
