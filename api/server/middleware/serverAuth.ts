import { getUserByAuthToken } from "../app/userService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const protectedRoutes = [
    "/album",
    "/photo",
    "/user",
  ];

  if (!protectedRoutes.some((route) => event.path?.startsWith(route))) {
    return;
  }

  const authToken = getCookie(event, "authToken");
  if (!authToken) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "unauthorized",
      }),
    );
  }
  event.context.authToken = authToken;

  const user = await getUserByAuthToken(authToken);
  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "unauthorized",
      }),
    );
  }

  event.context.user = user;
});
