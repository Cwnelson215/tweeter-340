import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
  event: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  try {
    const statusService = new StatusService();
    const [items, hasMore] = await statusService.loadMoreFeedItems(
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
