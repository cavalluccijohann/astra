import { H3Event } from "h3";
import { getUserByAuthToken } from "../../app/userService";

export default defineEventHandler(async (event: H3Event) => {
  const authHeader = event.headers.get("Authorization")
  if (!authHeader) return null;
  const authToken = authHeader.split(" ")[1];
  return await getUserByAuthToken(authToken);
});
