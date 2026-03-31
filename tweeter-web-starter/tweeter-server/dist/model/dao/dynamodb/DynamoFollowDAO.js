"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFollowDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const TABLE_NAME = "follows";
const INDEX_NAME = "follows_index";
class DynamoFollowDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    async putFollow(followerAlias, followeeAlias) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        }));
    }
    async deleteFollow(followerAlias, followeeAlias) {
        await this.client.send(new lib_dynamodb_1.DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        }));
    }
    async getIsFollower(followerAlias, followeeAlias) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: TABLE_NAME,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        }));
        return !!result.Item;
    }
    async getFollowerCount(followeeAlias) {
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: TABLE_NAME,
            IndexName: INDEX_NAME,
            KeyConditionExpression: "followee_handle = :followee",
            ExpressionAttributeValues: { ":followee": followeeAlias },
            Select: "COUNT",
        }));
        return result.Count ?? 0;
    }
    async getFolloweeCount(followerAlias) {
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "follower_handle = :follower",
            ExpressionAttributeValues: { ":follower": followerAlias },
            Select: "COUNT",
        }));
        return result.Count ?? 0;
    }
    async getPageOfFollowees(followerAlias, pageSize, lastFolloweeAlias) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "follower_handle = :follower",
            ExpressionAttributeValues: { ":follower": followerAlias },
            Limit: pageSize,
        };
        if (lastFolloweeAlias) {
            params.ExclusiveStartKey = {
                follower_handle: followerAlias,
                followee_handle: lastFolloweeAlias,
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const aliases = (result.Items ?? []).map((item) => item.followee_handle);
        return { aliases, hasMore: !!result.LastEvaluatedKey };
    }
    async getPageOfFollowers(followeeAlias, pageSize, lastFollowerAlias) {
        const params = {
            TableName: TABLE_NAME,
            IndexName: INDEX_NAME,
            KeyConditionExpression: "followee_handle = :followee",
            ExpressionAttributeValues: { ":followee": followeeAlias },
            Limit: pageSize,
        };
        if (lastFollowerAlias) {
            params.ExclusiveStartKey = {
                followee_handle: followeeAlias,
                follower_handle: lastFollowerAlias,
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const aliases = (result.Items ?? []).map((item) => item.follower_handle);
        return { aliases, hasMore: !!result.LastEvaluatedKey };
    }
    async getAllFollowers(followeeAlias) {
        const allAliases = [];
        let lastKey;
        do {
            const params = {
                TableName: TABLE_NAME,
                IndexName: INDEX_NAME,
                KeyConditionExpression: "followee_handle = :followee",
                ExpressionAttributeValues: { ":followee": followeeAlias },
            };
            if (lastKey) {
                params.ExclusiveStartKey = lastKey;
            }
            const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
            for (const item of result.Items ?? []) {
                allAliases.push(item.follower_handle);
            }
            lastKey = result.LastEvaluatedKey;
        } while (lastKey);
        return allAliases;
    }
}
exports.DynamoFollowDAO = DynamoFollowDAO;
