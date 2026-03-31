"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const DynamoUserDAO_1 = require("./DynamoUserDAO");
const DynamoAuthTokenDAO_1 = require("./DynamoAuthTokenDAO");
const DynamoFollowDAO_1 = require("./DynamoFollowDAO");
const DynamoStatusDAO_1 = require("./DynamoStatusDAO");
const DynamoFeedDAO_1 = require("./DynamoFeedDAO");
const S3DAO_1 = require("../s3/S3DAO");
class DynamoDAOFactory {
    getUserDAO() {
        return new DynamoUserDAO_1.DynamoUserDAO();
    }
    getAuthTokenDAO() {
        return new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
    }
    getFollowDAO() {
        return new DynamoFollowDAO_1.DynamoFollowDAO();
    }
    getStatusDAO() {
        return new DynamoStatusDAO_1.DynamoStatusDAO();
    }
    getFeedDAO() {
        return new DynamoFeedDAO_1.DynamoFeedDAO();
    }
    getS3DAO() {
        return new S3DAO_1.S3DAO();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
