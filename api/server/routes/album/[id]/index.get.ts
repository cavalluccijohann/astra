import { createAlbum, getAlbum } from "../../../amazon";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, "id");
  return {
    status: 200,
    content: await getAlbum(event.context.user, id)
  }
});
