import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IStatusDAO, StatusRecord } from "../interface/IStatusDAO";

const TABLE_NAME = "story";

export class DynamoStatusDAO implements IStatusDAO {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  async putStatus(
    senderAlias: string,
    timestamp: number,
    post: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { sender_alias: senderAlias, timestamp, post },
      })
    );
  }

  async getPageOfStory(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<{ statuses: StatusRecord[]; hasMore: boolean }> {
    const params: any = {
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

    const result = await this.client.send(new QueryCommand(params));
    const statuses: StatusRecord[] = (result.Items ?? []).map((item) => ({
      senderAlias: item.sender_alias as string,
      timestamp: item.timestamp as number,
      post: item.post as string,
    }));

    return { statuses, hasMore: !!result.LastEvaluatedKey };
  }
}
