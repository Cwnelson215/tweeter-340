import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IAuthTokenDAO, AuthTokenRecord } from "../interface/IAuthTokenDAO";

const TABLE_NAME = "auth_tokens";

export class DynamoAuthTokenDAO implements IAuthTokenDAO {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  async putAuthToken(
    token: string,
    timestamp: number,
    alias: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { token, timestamp, alias },
      })
    );
  }

  async getAuthToken(token: string): Promise<AuthTokenRecord | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    if (!result.Item) return null;

    return {
      token: result.Item.token,
      timestamp: result.Item.timestamp,
      alias: result.Item.alias,
    };
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );
  }
}
