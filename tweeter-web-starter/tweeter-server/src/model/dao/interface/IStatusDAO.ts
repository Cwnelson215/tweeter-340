export interface StatusRecord {
  senderAlias: string;
  timestamp: number;
  post: string;
}

export interface IStatusDAO {
  putStatus(
    senderAlias: string,
    timestamp: number,
    post: string
  ): Promise<void>;

  getPageOfStory(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<{ statuses: StatusRecord[]; hasMore: boolean }>;
}
