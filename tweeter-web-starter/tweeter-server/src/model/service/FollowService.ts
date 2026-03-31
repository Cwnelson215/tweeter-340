import { UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.validateToken(token);

    const { aliases, hasMore } = await this.daoFactory
      .getFollowDAO()
      .getPageOfFollowees(userAlias, pageSize, lastItem?.alias ?? undefined);

    const users = await this.aliasesToUserDtos(aliases);
    return [users, hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.validateToken(token);

    const { aliases, hasMore } = await this.daoFactory
      .getFollowDAO()
      .getPageOfFollowers(userAlias, pageSize, lastItem?.alias ?? undefined);

    const users = await this.aliasesToUserDtos(aliases);
    return [users, hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.validateToken(token);
    return this.daoFactory
      .getFollowDAO()
      .getIsFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    await this.validateToken(token);
    return this.daoFactory.getFollowDAO().getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    await this.validateToken(token);
    return this.daoFactory.getFollowDAO().getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    const currentUserAlias = await this.validateToken(token);
    await this.daoFactory
      .getFollowDAO()
      .putFollow(currentUserAlias, userToFollow.alias);

    const followerCount = await this.daoFactory
      .getFollowDAO()
      .getFollowerCount(userToFollow.alias);
    const followeeCount = await this.daoFactory
      .getFollowDAO()
      .getFolloweeCount(userToFollow.alias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    const currentUserAlias = await this.validateToken(token);
    await this.daoFactory
      .getFollowDAO()
      .deleteFollow(currentUserAlias, userToUnfollow.alias);

    const followerCount = await this.daoFactory
      .getFollowDAO()
      .getFollowerCount(userToUnfollow.alias);
    const followeeCount = await this.daoFactory
      .getFollowDAO()
      .getFolloweeCount(userToUnfollow.alias);

    return [followerCount, followeeCount];
  }

  private async aliasesToUserDtos(aliases: string[]): Promise<UserDto[]> {
    const userDAO = this.daoFactory.getUserDAO();
    const users: UserDto[] = [];
    for (const alias of aliases) {
      const record = await userDAO.getUser(alias);
      if (record) {
        users.push({
          firstName: record.firstName,
          lastName: record.lastName,
          alias: record.alias,
          imageUrl: record.imageUrl,
        });
      }
    }
    return users;
  }
}
