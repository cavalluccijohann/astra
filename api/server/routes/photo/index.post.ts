import { uploadPhoto } from "../../app/photoService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const body = await readBody(event) as File;
  console.log("Filename:", body.name, "Size:", body.size, "Type:", body.type, "Last Modified:", body.lastModified);
  await uploadPhoto(user, body);
  return {
    status: 200,
    content: {
      message: "Photo uploaded",
    }
  }
});
