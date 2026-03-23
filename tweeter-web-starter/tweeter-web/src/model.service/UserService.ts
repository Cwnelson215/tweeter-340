import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.serverFacade.getUser(authToken, alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.login(alias, password);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return this.serverFacade.register(
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension
    );
  }

  public async logout(authToken: AuthToken): Promise<void> {
    return this.serverFacade.logout(authToken);
  }
}
