"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../model/service/UserService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    try {
        const userService = new UserService_1.UserService(new DynamoDAOFactory_1.DynamoDAOFactory());
        await userService.logout(event.token);
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
