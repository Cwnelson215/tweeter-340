import { IUserDAO } from "./IUserDAO";
import { IAuthTokenDAO } from "./IAuthTokenDAO";
import { IFollowDAO } from "./IFollowDAO";
import { IStatusDAO } from "./IStatusDAO";
import { IFeedDAO } from "./IFeedDAO";
import { IS3DAO } from "./IS3DAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getAuthTokenDAO(): IAuthTokenDAO;
  getFollowDAO(): IFollowDAO;
  getStatusDAO(): IStatusDAO;
  getFeedDAO(): IFeedDAO;
  getS3DAO(): IS3DAO;
}
