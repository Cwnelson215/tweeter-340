"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    try {
        const followService = new FollowService_1.FollowService(new DynamoDAOFactory_1.DynamoDAOFactory());
        const [items, hasMore] = await followService.loadMoreFollowees(event.token, event.userAlias, event.pageSize, event.lastItem);
        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            items: null,
            hasMore: false,
        };
    }
};
exports.handler = handler;
