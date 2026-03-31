"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoAuthTokenDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const TABLE_NAME = "auth_tokens";
class DynamoAuthTokenDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    async putAuthToken(token, timestamp, alias) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: { token, timestamp, alias },
        }));
    }
    async getAuthToken(token) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: TABLE_NAME,
            Key: { token },
        }));
        if (!result.Item)
            return null;
        return {
            token: result.Item.token,
            timestamp: result.Item.timestamp,
            alias: result.Item.alias,
        };
    }
    async deleteAuthToken(token) {
        await this.client.send(new lib_dynamodb_1.DeleteCommand({
            TableName: TABLE_NAME,
            Key: { token },
        }));
    }
}
exports.DynamoAuthTokenDAO = DynamoAuthTokenDAO;
