import { uploadPhoto } from "../../app/photoService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const form = await readFormData(event)
  const image = form.get('image') as File;
  await uploadPhoto(user, image);
  return {
    status: 200,
    content: {
      message: "Photo uploaded",
    }
  }
});
