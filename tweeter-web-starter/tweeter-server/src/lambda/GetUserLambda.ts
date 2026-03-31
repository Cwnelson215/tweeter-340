import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: GetUserRequest
): Promise<GetUserResponse> => {
  try {
    const userService = new UserService(new DynamoDAOFactory());
    const user = await userService.getUser(event.token, event.alias);
    return {
      success: true,
      message: null,
      user: user,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      user: null,
    };
  }
};
