import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: RegisterRequest
): Promise<AuthenticateResponse> => {
  try {
    const userService = new UserService(new DynamoDAOFactory());
    const [user, authToken] = await userService.register(
      event.firstName,
      event.lastName,
      event.alias,
      event.password,
      event.imageStringBase64,
      event.imageFileExtension
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
