"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoUserDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const TABLE_NAME = "users";
class DynamoUserDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    async putUser(alias, firstName, lastName, imageUrl, passwordHash) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: { alias, firstName, lastName, imageUrl, passwordHash },
        }));
    }
    async getUser(alias) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: TABLE_NAME,
            Key: { alias },
        }));
        if (!result.Item)
            return null;
        return {
            alias: result.Item.alias,
            firstName: result.Item.firstName,
            lastName: result.Item.lastName,
            imageUrl: result.Item.imageUrl,
            passwordHash: result.Item.passwordHash,
        };
    }
}
exports.DynamoUserDAO = DynamoUserDAO;
