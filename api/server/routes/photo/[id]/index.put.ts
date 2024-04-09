import { H3Event } from "h3";
import { putPhotoInAlbum } from "../../../app/photoService";

export default defineEventHandler(async (event: H3Event) => {
    const albumId = readBody(event).albumId;
    const photoId = getRouterParam(event, "id");
    await putPhotoInAlbum(photoId, albumId);
    return {
        status: 204,
    }
});