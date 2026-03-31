import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: PostStatusRequest
): Promise<TweeterResponse> => {
  try {
    const statusService = new StatusService(new DynamoDAOFactory());
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
