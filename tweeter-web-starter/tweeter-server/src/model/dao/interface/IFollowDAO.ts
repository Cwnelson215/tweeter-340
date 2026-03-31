export interface IFollowDAO {
  putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getIsFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  getFolloweeCount(followerAlias: string): Promise<number>;
  getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | undefined
  ): Promise<{ aliases: string[]; hasMore: boolean }>;
  getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | undefined
  ): Promise<{ aliases: string[]; hasMore: boolean }>;
  getAllFollowers(followeeAlias: string): Promise<string[]>;
}
