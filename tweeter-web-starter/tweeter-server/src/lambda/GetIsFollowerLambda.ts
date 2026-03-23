import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
  event: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  try {
    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(
      event.token,
      event.user,
      event.selectedUser
    );
    return {
      success: true,
      message: null,
      isFollower: isFollower,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      isFollower: false,
    };
  }
};
