import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: LoginRequest
): Promise<AuthenticateResponse> => {
  try {
    const userService = new UserService(new DynamoDAOFactory());
    const [user, authToken] = await userService.login(
      event.alias,
      event.password
    );
    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      user: null!,
      authToken: null!,
    };
  }
};
