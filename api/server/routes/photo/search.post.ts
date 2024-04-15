import { H3Event } from "h3";
import { searchPhotos } from "../../app/photoService";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const search = body.search;
  const photos = await searchPhotos(search);
  return {
    status: 200,
    content: photos,
  };
});
