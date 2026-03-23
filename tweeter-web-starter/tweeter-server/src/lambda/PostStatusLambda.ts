import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
  event: PostStatusRequest
): Promise<TweeterResponse> => {
  try {
    const statusService = new StatusService();
    await statusService.postStatus(event.token, event.status);
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
