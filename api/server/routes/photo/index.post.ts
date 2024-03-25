import { H3Event } from "h3";
import { uploadPhoto } from "../../amazon";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const body = await readBody(event);
  await uploadPhoto(user, "6a823cf8-81ba-4ac6-81ca-88e0eaaa3e9b", body);
  return {
    status: 200,
    content: {
      message: "Photo uploaded",
    }
  }
});
