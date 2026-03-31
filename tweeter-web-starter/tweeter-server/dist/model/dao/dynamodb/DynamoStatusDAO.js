"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoStatusDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const TABLE_NAME = "story";
class DynamoStatusDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    async putStatus(senderAlias, timestamp, post) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: { sender_alias: senderAlias, timestamp, post },
        }));
    }
    async getPageOfStory(senderAlias, pageSize, lastTimestamp) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "sender_alias = :sender",
            ExpressionAttributeValues: { ":sender": senderAlias },
            Limit: pageSize,
            ScanIndexForward: false,
        };
        if (lastTimestamp !== undefined) {
            params.ExclusiveStartKey = {
                sender_alias: senderAlias,
                timestamp: lastTimestamp,
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const statuses = (result.Items ?? []).map((item) => ({
            senderAlias: item.sender_alias,
            timestamp: item.timestamp,
            post: item.post,
        }));
        return { statuses, hasMore: !!result.LastEvaluatedKey };
    }
}
exports.DynamoStatusDAO = DynamoStatusDAO;
