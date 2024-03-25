import { uploadPhoto } from "../../app/photoService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const body = await readBody(event) as FormData;
  const file = body.get("photo") as File;
  console.log("Filename:", file.name, "Size:", file.size, "Type:", file.type, "Last Modified:", file.lastModified);
  await uploadPhoto(user, file);
  return {
    status: 200,
    content: {
      message: "Photo uploaded",
    }
  }
});
