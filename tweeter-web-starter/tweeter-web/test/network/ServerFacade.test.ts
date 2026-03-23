import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import { AuthToken, User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();
  let authToken: AuthToken;
  let user: User;

  beforeAll(async () => {
    [user, authToken] = await serverFacade.register(
      "Test",
      "User",
      "@testuser",
      "password",
      "fakeImageBase64",
      "png"
    );
  });

  test("register returns a User and AuthToken", () => {
    expect(user).not.toBeNull();
    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(user.alias).toBe("@allen");
    expect(authToken).not.toBeNull();
    expect(authToken.token).toBeDefined();
    expect(authToken.timestamp).toBeGreaterThan(0);
  });

  test("getFollowers returns a list of users and hasMore flag", async () => {
    const [followers, hasMore] = await serverFacade.loadMoreFollowers(
      authToken,
      user.alias,
      10,
      null
    );

    expect(followers).toBeDefined();
    expect(followers.length).toBeGreaterThan(0);
    expect(typeof hasMore).toBe("boolean");

    for (const follower of followers) {
      expect(follower).toBeInstanceOf(User);
      expect(follower.alias).toBeDefined();
    }
  });

  test("getFollowerCount returns a number", async () => {
    const count = await serverFacade.getFollowerCount(authToken, user);
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThan(0);
  });

  test("getFolloweeCount returns a number", async () => {
    const count = await serverFacade.getFolloweeCount(authToken, user);
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThan(0);
  });
});
