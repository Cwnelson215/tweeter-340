"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (event) => {
    try {
        const followService = new FollowService_1.FollowService();
        const count = await followService.getFolloweeCount(event.token, event.user);
        return {
            success: true,
            message: null,
            count: count,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            count: 0,
        };
    }
};
exports.handler = handler;
