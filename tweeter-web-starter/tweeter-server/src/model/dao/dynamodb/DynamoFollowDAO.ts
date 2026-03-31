import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IFollowDAO } from "../interface/IFollowDAO";

const TABLE_NAME = "follows";
const INDEX_NAME = "follows_index";

export class DynamoFollowDAO implements IFollowDAO {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  async putFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
  }

  async deleteFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
  }

  async getIsFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
    return !!result.Item;
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :followee",
        ExpressionAttributeValues: { ":followee": followeeAlias },
        Select: "COUNT",
      })
    );
    return result.Count ?? 0;
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "follower_handle = :follower",
        ExpressionAttributeValues: { ":follower": followerAlias },
        Select: "COUNT",
      })
    );
    return result.Count ?? 0;
  }

  async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | undefined
  ): Promise<{ aliases: string[]; hasMore: boolean }> {
    const params: any = {
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

    const result = await this.client.send(new QueryCommand(params));
    const aliases = (result.Items ?? []).map(
      (item) => item.followee_handle as string
    );
    return { aliases, hasMore: !!result.LastEvaluatedKey };
  }

  async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | undefined
  ): Promise<{ aliases: string[]; hasMore: boolean }> {
    const params: any = {
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

    const result = await this.client.send(new QueryCommand(params));
    const aliases = (result.Items ?? []).map(
      (item) => item.follower_handle as string
    );
    return { aliases, hasMore: !!result.LastEvaluatedKey };
  }

  async getAllFollowers(followeeAlias: string): Promise<string[]> {
    const allAliases: string[] = [];
    let lastKey: Record<string, any> | undefined;

    do {
      const params: any = {
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :followee",
        ExpressionAttributeValues: { ":followee": followeeAlias },
      };

      if (lastKey) {
        params.ExclusiveStartKey = lastKey;
      }

      const result = await this.client.send(new QueryCommand(params));
      for (const item of result.Items ?? []) {
        allAliases.push(item.follower_handle as string);
      }
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return allAliases;
  }
}
