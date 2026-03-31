export interface UserRecord {
  alias: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  passwordHash: string;
}

export interface IUserDAO {
  putUser(
    alias: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
    passwordHash: string
  ): Promise<void>;

  getUser(alias: string): Promise<UserRecord | null>;
}
