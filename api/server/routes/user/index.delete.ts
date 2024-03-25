import { deleteUser } from "../../app/userService";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const user = event.context.user;
  await deleteUser(user);
  deleteCookie(event, "authToken");
  return {
    status: 200,
    content: {
      message: "User deleted"
    }
  };
});
