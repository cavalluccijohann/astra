import { deleteUser } from "../../app/userService";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const user = event.context.user;
  await deleteUser(user.id);
  deleteCookie(event, "authToken");
  return {
    statusCode: 200,
    message: "User deleted",
  };
});
