import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  try {
    const followService = new FollowService(new DynamoDAOFactory());
    const [items, hasMore] = await followService.loadMoreFollowees(
      event.token,
      event.userAlias,
      event.pageSize,
      event.lastItem
    );
    return {
      success: true,
      message: null,
      items: items,
      hasMore: hasMore,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      items: null,
      hasMore: false,
    };
  }
};
