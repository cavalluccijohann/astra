import { login } from "../../app/authService";
import { formatUser } from "../../client";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { email, password } = body;
  const { user, authToken} = await login(email, password);
  setCookie(event, "authToken", authToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return formatUser(user);
});
