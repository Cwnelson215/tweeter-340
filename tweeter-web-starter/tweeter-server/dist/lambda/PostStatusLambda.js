"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    try {
        const statusService = new StatusService_1.StatusService(new DynamoDAOFactory_1.DynamoDAOFactory());
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
