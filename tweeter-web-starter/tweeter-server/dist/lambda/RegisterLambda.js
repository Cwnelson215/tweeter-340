"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../model/service/UserService");
const handler = async (event) => {
    try {
        const userService = new UserService_1.UserService();
        const [user, authToken] = await userService.register(event.firstName, event.lastName, event.alias, event.password, event.imageStringBase64, event.imageFileExtension);
        return {
            success: true,
            message: null,
            user: user,
            authToken: authToken,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            user: null,
            authToken: null,
        };
    }
};
exports.handler = handler;
