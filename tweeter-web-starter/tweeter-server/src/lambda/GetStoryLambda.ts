import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  try {
    const statusService = new StatusService(new DynamoDAOFactory());
    const [items, hasMore] = await statusService.loadMoreStoryItems(
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
