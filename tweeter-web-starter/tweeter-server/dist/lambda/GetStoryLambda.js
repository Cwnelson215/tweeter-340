"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const handler = async (event) => {
    try {
        const statusService = new StatusService_1.StatusService();
        const [items, hasMore] = await statusService.loadMoreStoryItems(event.token, event.userAlias, event.pageSize, event.lastItem);
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
