import { IDAOFactory } from "../interface/IDAOFactory";
import { IUserDAO } from "../interface/IUserDAO";
import { IAuthTokenDAO } from "../interface/IAuthTokenDAO";
import { IFollowDAO } from "../interface/IFollowDAO";
import { IStatusDAO } from "../interface/IStatusDAO";
import { IFeedDAO } from "../interface/IFeedDAO";
import { IS3DAO } from "../interface/IS3DAO";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoFeedDAO } from "./DynamoFeedDAO";
import { S3DAO } from "../s3/S3DAO";

export class DynamoDAOFactory implements IDAOFactory {
  getUserDAO(): IUserDAO {
    return new DynamoUserDAO();
  }

  getAuthTokenDAO(): IAuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  getFollowDAO(): IFollowDAO {
    return new DynamoFollowDAO();
  }

  getStatusDAO(): IStatusDAO {
    return new DynamoStatusDAO();
  }

  getFeedDAO(): IFeedDAO {
    return new DynamoFeedDAO();
  }

  getS3DAO(): IS3DAO {
    return new S3DAO();
  }
}
