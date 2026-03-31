import { FollowInfoRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: FollowInfoRequest
): Promise<FollowResponse> => {
  try {
    const followService = new FollowService(new DynamoDAOFactory());
    const [followerCount, followeeCount] = await followService.unfollow(
      event.token,
      event.user
    );
    return {
      success: true,
      message: null,
      followerCount: followerCount,
      followeeCount: followeeCount,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      followerCount: 0,
      followeeCount: 0,
    };
  }
};
