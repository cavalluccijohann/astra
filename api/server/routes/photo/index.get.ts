import { H3Event } from "h3";
import { getUserPhotos } from "../../app/photoService";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const photos = await getUserPhotos(user.id);
  return {
    status: 200,
    content: {
      photos,
    }
  }
});
