import { checkPhoto, uploadPhoto } from "~/app/photoService";
import { H3Event } from "h3";
import sharp from "sharp";

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const form = await readFormData(event);
  const images = form.getAll('images') as File[];
  const exifDataJson = form.get('exif') || '{}';
  const exifData = JSON.parse(exifDataJson as string) || {};

  const compressedImagesPromises = images.map(async (image) => {
    const buffer = await image.arrayBuffer();
    const img = sharp(Buffer.from(buffer));

    img.withMetadata();

    const metadata = await img.metadata();
    const maxWidth = 1920;
    const maxHeight = 1080;
    const { width, height } = metadata;

    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    const newWidth = Math.floor(width * ratio);
    const newHeight = Math.floor(height * ratio);

    const compressedImage = await img
      .resize(newWidth, newHeight)
      .jpeg({ quality: 80 })
      .toBuffer();

    return new File([compressedImage], image.name, { type: 'image/jpeg' });
  });

  const compressedImages = await Promise.all(compressedImagesPromises);

  await Promise.all(compressedImages.map(async (image) => {
    const upload = checkPhoto(image);
    if (upload) await uploadPhoto(user, image, exifData);
  }));
  return {
    status: 200,
    content: {
      message: "Photos uploaded and compressed successfully",
    }
  }
});
