import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IFeedDAO, FeedRecord } from "../interface/IFeedDAO";

const TABLE_NAME = "feed";

export class DynamoFeedDAO implements IFeedDAO {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  async putFeedItem(
    receiverAlias: string,
    senderAlias: string,
    timestamp: number,
    post: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          receiver_alias: receiverAlias,
          sender_alias: senderAlias,
          timestamp,
          post,
        },
      })
    );
  }

  async getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<{ statuses: FeedRecord[]; hasMore: boolean }> {
    const params: any = {
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

    const result = await this.client.send(new QueryCommand(params));
    const statuses: FeedRecord[] = (result.Items ?? []).map((item) => ({
      receiverAlias: item.receiver_alias as string,
      senderAlias: item.sender_alias as string,
      timestamp: item.timestamp as number,
      post: item.post as string,
    }));

    return { statuses, hasMore: !!result.LastEvaluatedKey };
  }
}
