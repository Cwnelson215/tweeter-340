"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (event) => {
    try {
        const followService = new FollowService_1.FollowService();
        const [followerCount, followeeCount] = await followService.follow(event.token, event.user);
        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            followerCount: 0,
            followeeCount: 0,
        };
    }
};
exports.handler = handler;
