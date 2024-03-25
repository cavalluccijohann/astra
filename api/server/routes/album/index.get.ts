import { getPublicAlbums } from "../../amazon";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return {
    statusCode: 201,
    body: await getPublicAlbums()
  };
});
