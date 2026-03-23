import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
  event: LogoutRequest
): Promise<TweeterResponse> => {
  try {
    const userService = new UserService();
    await userService.logout(event.token);
    return {
      success: true,
      message: null,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  }
};
