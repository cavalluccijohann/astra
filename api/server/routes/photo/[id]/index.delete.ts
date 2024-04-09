import {H3Event} from "h3";
import {deletePhoto, deletePhotoAlbum} from "../../../app/photoService";

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event);
    const deleteAlbum = body.deleteAlbum;
    const user = event.context.user;
    const id = getRouterParam(event, "id");
    if (deleteAlbum) {
        const albumId = body.albumId;
        await deletePhotoAlbum(user, id, albumId);
        return {
            status: 204,
        }
    } else {
        await deletePhoto(user, id);
        return {
            status: 204,
        }
    }
});