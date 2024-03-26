import { login } from "../../app/authService";
import { formatUser } from "../../client";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { email, password } = body;
  const { user, authToken} = await login(email, password);
  return {
    user: formatUser(user),
    authToken,
  }
});
