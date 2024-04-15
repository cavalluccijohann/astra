import { checkPhoto, uploadPhoto } from "../../app/photoService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const form = await readFormData(event)
  const images = form.getAll('images') as File[];
  const exifDataJson = form.get('exif') || '{}';
  const exifData = JSON.parse(exifDataJson as string) || {};
  await Promise.all(images.map(async (image) => {
    const upload = checkPhoto(image);
    if (upload) await uploadPhoto(user, image, exifData);
  }));
  return {
    status: 200,
    content: {
      message: "Photo uploaded",
    }
  }
});
