import { uploadPhoto } from "../../../amazon";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const body = await readBody(event) as File;
  await uploadPhoto(user, user.defaultAlbum, body);
  return {
    status: 200,
    content: {
      message: "Photo uploaded",
    }
  }
});
