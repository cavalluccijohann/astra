import { getPublicAlbums } from "../../app/albumService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return {
    status: 200,
    content: await getPublicAlbums()
  }
});
