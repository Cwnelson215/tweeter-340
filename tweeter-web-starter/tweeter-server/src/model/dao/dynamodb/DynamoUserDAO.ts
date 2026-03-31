import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IUserDAO, UserRecord } from "../interface/IUserDAO";

const TABLE_NAME = "users";

export class DynamoUserDAO implements IUserDAO {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  async putUser(
    alias: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
    passwordHash: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { alias, firstName, lastName, imageUrl, passwordHash },
      })
    );
  }

  async getUser(alias: string): Promise<UserRecord | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    if (!result.Item) return null;

    return {
      alias: result.Item.alias,
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      imageUrl: result.Item.imageUrl,
      passwordHash: result.Item.passwordHash,
    };
  }
}
