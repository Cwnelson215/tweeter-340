import {
  AuthenticateResponse,
  AuthToken,
  FollowCountResponse,
  FollowInfoRequest,
  FollowResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://hettl6t573.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = { alias, password };
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, "/auth/login");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);
      if (user == null) throw new Error("Invalid user returned");
      if (authToken == null) throw new Error("Invalid auth token returned");
      return [user, authToken];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Login failed");
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension,
    };
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthenticateResponse
    >(request, "/auth/register");

    if (response.success) {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);
      if (user == null) throw new Error("Invalid user returned");
      if (authToken == null) throw new Error("Invalid auth token returned");
      return [user, authToken];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Registration failed");
    }
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
    };
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/auth/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "Logout failed");
    }
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      alias,
    };
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    if (response.success) {
      return response.user ? User.fromDto(response.user) : null;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get user failed");
    }
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    if (response.success) {
      const items = response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get followees failed");
    }
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    if (response.success) {
      const items = response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get followers failed");
    }
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: IsFollowerRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      user: user.toDto(),
      selectedUser: selectedUser.toDto(),
    };
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/user/is-follower");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get is follower status failed");
    }
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowInfoRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      user: user.toDto(),
    };
    const response = await this.clientCommunicator.doPost<
      FollowInfoRequest,
      FollowCountResponse
    >(request, "/user/followee-count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get followee count failed");
    }
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowInfoRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      user: user.toDto(),
    };
    const response = await this.clientCommunicator.doPost<
      FollowInfoRequest,
      FollowCountResponse
    >(request, "/user/follower-count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get follower count failed");
    }
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[number, number]> {
    const request: FollowInfoRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      user: userToFollow.toDto(),
    };
    const response = await this.clientCommunicator.doPost<
      FollowInfoRequest,
      FollowResponse
    >(request, "/user/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Follow failed");
    }
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[number, number]> {
    const request: FollowInfoRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      user: userToUnfollow.toDto(),
    };
    const response = await this.clientCommunicator.doPost<
      FollowInfoRequest,
      FollowResponse
    >(request, "/user/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unfollow failed");
    }
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    if (response.success) {
      const items = response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get feed items failed");
    }
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.toDto() : null,
    };
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    if (response.success) {
      const items = response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Get story items failed");
    }
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      timestamp: authToken.timestamp,
      status: newStatus.toDto(),
    };
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "Post status failed");
    }
  }
}
