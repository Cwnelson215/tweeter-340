"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (event) => {
    try {
        const followService = new FollowService_1.FollowService();
        const isFollower = await followService.getIsFollowerStatus(event.token, event.user, event.selectedUser);
        return {
            success: true,
            message: null,
            isFollower: isFollower,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            isFollower: false,
        };
    }
};
exports.handler = handler;
