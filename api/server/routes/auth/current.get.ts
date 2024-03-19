import { H3Event } from "h3";
import { getUserByAuthToken } from "../../app/userService";

export default defineEventHandler(async (event: H3Event) => {
  const authToken = getCookie(event, "authToken");
  return await getUserByAuthToken(authToken);
});
