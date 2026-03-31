import { Status, StatusDto, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.validateToken(token);

    const { statuses, hasMore } = await this.daoFactory
      .getFeedDAO()
      .getPageOfFeed(userAlias, pageSize, lastItem?.timestamp ?? undefined);

    const statusDtos = await this.toStatusDtos(statuses);
    return [statusDtos, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.validateToken(token);

    const { statuses, hasMore } = await this.daoFactory
      .getStatusDAO()
      .getPageOfStory(userAlias, pageSize, lastItem?.timestamp ?? undefined);

    const statusDtos = await this.toStatusDtos(statuses);
    return [statusDtos, hasMore];
  }

  public async postStatus(
    token: string,
    status: StatusDto
  ): Promise<void> {
    const senderAlias = await this.validateToken(token);

    // Write to sender's story
    await this.daoFactory
      .getStatusDAO()
      .putStatus(senderAlias, status.timestamp, status.post);

    // Fan out to all followers' feeds
    const followers = await this.daoFactory
      .getFollowDAO()
      .getAllFollowers(senderAlias);

    const feedDAO = this.daoFactory.getFeedDAO();
    for (const followerAlias of followers) {
      await feedDAO.putFeedItem(
        followerAlias,
        senderAlias,
        status.timestamp,
        status.post
      );
    }
  }

  private async toStatusDtos(
    statuses: { senderAlias: string; timestamp: number; post: string }[]
  ): Promise<StatusDto[]> {
    const userDAO = this.daoFactory.getUserDAO();
    const userCache = new Map<string, UserDto>();
    const result: StatusDto[] = [];

    for (const s of statuses) {
      let userDto = userCache.get(s.senderAlias);
      if (!userDto) {
        const record = await userDAO.getUser(s.senderAlias);
        if (!record) continue;
        userDto = {
          firstName: record.firstName,
          lastName: record.lastName,
          alias: record.alias,
          imageUrl: record.imageUrl,
        };
        userCache.set(s.senderAlias, userDto);
      }

      const user = new User(
        userDto.firstName,
        userDto.lastName,
        userDto.alias,
        userDto.imageUrl
      );
      const statusObj = new Status(s.post, user, s.timestamp);
      result.push(statusObj.toDto());
    }

    return result;
  }
}
