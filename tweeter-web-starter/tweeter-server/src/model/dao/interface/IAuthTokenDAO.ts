export interface AuthTokenRecord {
  token: string;
  timestamp: number;
  alias: string;
}

export interface IAuthTokenDAO {
  putAuthToken(token: string, timestamp: number, alias: string): Promise<void>;
  getAuthToken(token: string): Promise<AuthTokenRecord | null>;
  deleteAuthToken(token: string): Promise<void>;
}
