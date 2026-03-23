import { FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const lastUser = lastItem ? User.fromDto(lastItem) : null;
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastUser,
      pageSize,
      userAlias
    );
    return [users.map((u) => u.toDto()), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const lastUser = lastItem ? User.fromDto(lastItem) : null;
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastUser,
      pageSize,
      userAlias
    );
    return [users.map((u) => u.toDto()), hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    return FakeData.instance.getFolloweeCount(user.alias) as number;
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    return FakeData.instance.getFollowerCount(user.alias) as number;
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    return [followerCount, followeeCount];
  }
}
