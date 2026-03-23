"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const handler = async (event) => {
    try {
        const statusService = new StatusService_1.StatusService();
        await statusService.postStatus(event.token, event.status);
        return {
            success: true,
            message: null,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
        };
    }
};
exports.handler = handler;
