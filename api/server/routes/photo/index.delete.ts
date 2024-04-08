
import { H3Event } from "h3";
import { deletePhoto } from "../../app/photoService";

export default defineEventHandler(async (event: H3Event) => {
    const user = event.context.user;
    const id = getRouterParam(event, "id");
    await deletePhoto(user, id);
    return {
        status: 204,
    }
});