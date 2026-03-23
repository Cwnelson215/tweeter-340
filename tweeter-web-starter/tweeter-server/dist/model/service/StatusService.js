"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        const lastStatus = lastItem ? tweeter_shared_1.Status.fromDto(lastItem) : null;
        const [statuses, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastStatus, pageSize);
        return [statuses.map((s) => s.toDto()), hasMore];
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        const lastStatus = lastItem ? tweeter_shared_1.Status.fromDto(lastItem) : null;
        const [statuses, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastStatus, pageSize);
        return [statuses.map((s) => s.toDto()), hasMore];
    }
    async postStatus(token, status) {
        // Nothing to do for now
    }
}
exports.StatusService = StatusService;
