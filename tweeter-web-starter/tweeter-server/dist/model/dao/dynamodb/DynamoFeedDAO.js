"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFeedDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const TABLE_NAME = "feed";
class DynamoFeedDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    async putFeedItem(receiverAlias, senderAlias, timestamp, post) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: {
                receiver_alias: receiverAlias,
                sender_alias: senderAlias,
                timestamp,
                post,
            },
        }));
    }
    async getPageOfFeed(receiverAlias, pageSize, lastTimestamp) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "receiver_alias = :receiver",
            ExpressionAttributeValues: { ":receiver": receiverAlias },
            Limit: pageSize,
            ScanIndexForward: false,
        };
        if (lastTimestamp !== undefined) {
            params.ExclusiveStartKey = {
                receiver_alias: receiverAlias,
                timestamp: lastTimestamp,
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const statuses = (result.Items ?? []).map((item) => ({
            receiverAlias: item.receiver_alias,
            senderAlias: item.sender_alias,
            timestamp: item.timestamp,
            post: item.post,
        }));
        return { statuses, hasMore: !!result.LastEvaluatedKey };
    }
}
exports.DynamoFeedDAO = DynamoFeedDAO;
