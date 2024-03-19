import { updateUser } from "../../app/userService";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const user = event.context.user;
  const body = await readBody(event);
  await updateUser(user.id, body);
  return {
    statusCode: 200,
    message: "User updated",
  };
});
