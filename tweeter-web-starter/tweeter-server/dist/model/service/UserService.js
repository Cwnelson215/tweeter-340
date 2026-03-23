"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async login(alias, password) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        return [user.toDto(), tweeter_shared_1.FakeData.instance.authToken.toDto()];
    }
    async register(firstName, lastName, alias, password, imageStringBase64, imageFileExtension) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user.toDto(), tweeter_shared_1.FakeData.instance.authToken.toDto()];
    }
    async getUser(token, alias) {
        const user = tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
        return user ? user.toDto() : null;
    }
    async logout(token) {
        // Nothing to do for now
    }
}
exports.UserService = UserService;
