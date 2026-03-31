"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService extends Service_1.Service {
    async login(alias, password) {
        const userRecord = await this.daoFactory.getUserDAO().getUser(alias);
        if (userRecord === null) {
            throw new Error("Invalid alias or password");
        }
        const match = await bcryptjs_1.default.compare(password, userRecord.passwordHash);
        if (!match) {
            throw new Error("Invalid alias or password");
        }
        const authToken = tweeter_shared_1.AuthToken.Generate();
        await this.daoFactory
            .getAuthTokenDAO()
            .putAuthToken(authToken.token, authToken.timestamp, alias);
        const userDto = {
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            alias: userRecord.alias,
            imageUrl: userRecord.imageUrl,
        };
        return [userDto, authToken.toDto()];
    }
    async register(firstName, lastName, alias, password, imageStringBase64, imageFileExtension) {
        const existingUser = await this.daoFactory.getUserDAO().getUser(alias);
        if (existingUser !== null) {
            throw new Error("Alias already taken");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const imageUrl = await this.daoFactory
            .getS3DAO()
            .putImage(alias, imageStringBase64);
        await this.daoFactory
            .getUserDAO()
            .putUser(alias, firstName, lastName, imageUrl, passwordHash);
        const authToken = tweeter_shared_1.AuthToken.Generate();
        await this.daoFactory
            .getAuthTokenDAO()
            .putAuthToken(authToken.token, authToken.timestamp, alias);
        const userDto = {
            firstName,
            lastName,
            alias,
            imageUrl,
        };
        return [userDto, authToken.toDto()];
    }
    async getUser(token, alias) {
        await this.validateToken(token);
        const userRecord = await this.daoFactory.getUserDAO().getUser(alias);
        if (userRecord === null)
            return null;
        return {
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            alias: userRecord.alias,
            imageUrl: userRecord.imageUrl,
        };
    }
    async logout(token) {
        await this.daoFactory.getAuthTokenDAO().deleteAuthToken(token);
    }
}
exports.UserService = UserService;
