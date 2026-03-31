import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import bcrypt from "bcryptjs";

export class UserService extends Service {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userRecord = await this.daoFactory.getUserDAO().getUser(alias);

    if (userRecord === null) {
      throw new Error("Invalid alias or password");
    }

    const match = await bcrypt.compare(password, userRecord.passwordHash);
    if (!match) {
      throw new Error("Invalid alias or password");
    }

    const authToken = AuthToken.Generate();
    await this.daoFactory
      .getAuthTokenDAO()
      .putAuthToken(authToken.token, authToken.timestamp, alias);

    const userDto: UserDto = {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      alias: userRecord.alias,
      imageUrl: userRecord.imageUrl,
    };

    return [userDto, authToken.toDto()];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const existingUser = await this.daoFactory.getUserDAO().getUser(alias);
    if (existingUser !== null) {
      throw new Error("Alias already taken");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const imageUrl = await this.daoFactory
      .getS3DAO()
      .putImage(alias, imageStringBase64);

    await this.daoFactory
      .getUserDAO()
      .putUser(alias, firstName, lastName, imageUrl, passwordHash);

    const authToken = AuthToken.Generate();
    await this.daoFactory
      .getAuthTokenDAO()
      .putAuthToken(authToken.token, authToken.timestamp, alias);

    const userDto: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl,
    };

    return [userDto, authToken.toDto()];
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    await this.validateToken(token);

    const userRecord = await this.daoFactory.getUserDAO().getUser(alias);
    if (userRecord === null) return null;

    return {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      alias: userRecord.alias,
      imageUrl: userRecord.imageUrl,
    };
  }

  public async logout(token: string): Promise<void> {
    await this.daoFactory.getAuthTokenDAO().deleteAuthToken(token);
  }
}
