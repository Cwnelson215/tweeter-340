"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const Service_1 = require("./Service");
class FollowService extends Service_1.Service {
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        await this.validateToken(token);
        const { aliases, hasMore } = await this.daoFactory
            .getFollowDAO()
            .getPageOfFollowees(userAlias, pageSize, lastItem?.alias ?? undefined);
        const users = await this.aliasesToUserDtos(aliases);
        return [users, hasMore];
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        await this.validateToken(token);
        const { aliases, hasMore } = await this.daoFactory
            .getFollowDAO()
            .getPageOfFollowers(userAlias, pageSize, lastItem?.alias ?? undefined);
        const users = await this.aliasesToUserDtos(aliases);
        return [users, hasMore];
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        await this.validateToken(token);
        return this.daoFactory
            .getFollowDAO()
            .getIsFollower(user.alias, selectedUser.alias);
    }
    async getFolloweeCount(token, user) {
        await this.validateToken(token);
        return this.daoFactory.getFollowDAO().getFolloweeCount(user.alias);
    }
    async getFollowerCount(token, user) {
        await this.validateToken(token);
        return this.daoFactory.getFollowDAO().getFollowerCount(user.alias);
    }
    async follow(token, userToFollow) {
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
    async unfollow(token, userToUnfollow) {
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
    async aliasesToUserDtos(aliases) {
        const userDAO = this.daoFactory.getUserDAO();
        const users = [];
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
exports.FollowService = FollowService;
