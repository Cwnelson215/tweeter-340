"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
class Service {
    daoFactory;
    constructor(daoFactory) {
        this.daoFactory = daoFactory;
    }
    async validateToken(token) {
        const authTokenDAO = this.daoFactory.getAuthTokenDAO();
        const record = await authTokenDAO.getAuthToken(token);
        if (record === null) {
            throw new Error("[Unauthorized] Invalid auth token");
        }
        const now = Date.now();
        if (now - record.timestamp > TOKEN_EXPIRY_MS) {
            await authTokenDAO.deleteAuthToken(token);
            throw new Error("[Unauthorized] Auth token has expired");
        }
        // Refresh timestamp (sliding expiry)
        await authTokenDAO.putAuthToken(token, now, record.alias);
        return record.alias;
    }
}
exports.Service = Service;
