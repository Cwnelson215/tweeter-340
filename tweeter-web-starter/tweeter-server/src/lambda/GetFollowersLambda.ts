import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
  event: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  try {
    const followService = new FollowService();
    const [items, hasMore] = await followService.loadMoreFollowers(
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
