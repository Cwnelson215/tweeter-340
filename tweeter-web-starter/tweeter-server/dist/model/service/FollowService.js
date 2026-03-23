"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        const lastUser = lastItem ? tweeter_shared_1.User.fromDto(lastItem) : null;
        const [users, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(lastUser, pageSize, userAlias);
        return [users.map((u) => u.toDto()), hasMore];
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        const lastUser = lastItem ? tweeter_shared_1.User.fromDto(lastItem) : null;
        const [users, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(lastUser, pageSize, userAlias);
        return [users.map((u) => u.toDto()), hasMore];
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    async getFolloweeCount(token, user) {
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    async getFollowerCount(token, user) {
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    async follow(token, userToFollow) {
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        return [followerCount, followeeCount];
    }
    async unfollow(token, userToUnfollow) {
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
        return [followerCount, followeeCount];
    }
}
exports.FollowService = FollowService;
