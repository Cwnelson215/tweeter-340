import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  try {
    const followService = new FollowService(new DynamoDAOFactory());
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
