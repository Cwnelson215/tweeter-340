import { FollowCountResponse, FollowInfoRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
  event: FollowInfoRequest
): Promise<FollowCountResponse> => {
  try {
    const followService = new FollowService();
    const count = await followService.getFolloweeCount(
      event.token,
      event.user
    );
    return {
      success: true,
      message: null,
      count: count,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      count: 0,
    };
  }
};
