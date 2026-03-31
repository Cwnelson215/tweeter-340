"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
class StatusService extends Service_1.Service {
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        await this.validateToken(token);
        const { statuses, hasMore } = await this.daoFactory
            .getFeedDAO()
            .getPageOfFeed(userAlias, pageSize, lastItem?.timestamp ?? undefined);
        const statusDtos = await this.toStatusDtos(statuses);
        return [statusDtos, hasMore];
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        await this.validateToken(token);
        const { statuses, hasMore } = await this.daoFactory
            .getStatusDAO()
            .getPageOfStory(userAlias, pageSize, lastItem?.timestamp ?? undefined);
        const statusDtos = await this.toStatusDtos(statuses);
        return [statusDtos, hasMore];
    }
    async postStatus(token, status) {
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
            await feedDAO.putFeedItem(followerAlias, senderAlias, status.timestamp, status.post);
        }
    }
    async toStatusDtos(statuses) {
        const userDAO = this.daoFactory.getUserDAO();
        const userCache = new Map();
        const result = [];
        for (const s of statuses) {
            let userDto = userCache.get(s.senderAlias);
            if (!userDto) {
                const record = await userDAO.getUser(s.senderAlias);
                if (!record)
                    continue;
                userDto = {
                    firstName: record.firstName,
                    lastName: record.lastName,
                    alias: record.alias,
                    imageUrl: record.imageUrl,
                };
                userCache.set(s.senderAlias, userDto);
            }
            const user = new tweeter_shared_1.User(userDto.firstName, userDto.lastName, userDto.alias, userDto.imageUrl);
            const statusObj = new tweeter_shared_1.Status(s.post, user, s.timestamp);
            result.push(statusObj.toDto());
        }
        return result;
    }
}
exports.StatusService = StatusService;
