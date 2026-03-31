export interface FeedRecord {
  receiverAlias: string;
  senderAlias: string;
  timestamp: number;
  post: string;
}

export interface IFeedDAO {
  putFeedItem(
    receiverAlias: string,
    senderAlias: string,
    timestamp: number,
    post: string
  ): Promise<void>;

  getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<{ statuses: FeedRecord[]; hasMore: boolean }>;
}
