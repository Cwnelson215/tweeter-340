import "isomorphic-fetch";
import { StatusService } from "../../src/model.service/StatusService";
import { UserService } from "../../src/model.service/UserService";
import { AuthToken, Status, User } from "tweeter-shared";

describe("StatusService Integration Test", () => {
  const statusService = new StatusService();
  const userService = new UserService();
  let authToken: AuthToken;
  let user: User;

  beforeAll(async () => {
    [user, authToken] = await userService.login("@allen", "password");
  });

  test("loadMoreStoryItems returns status items", async () => {
    const [items, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      user.alias,
      10,
      null
    );

    expect(items).toBeDefined();
    expect(items.length).toBeGreaterThan(0);
    expect(typeof hasMore).toBe("boolean");

    for (const item of items) {
      expect(item).toBeInstanceOf(Status);
      expect(item.user).toBeDefined();
      expect(item.post).toBeDefined();
      expect(item.timestamp).toBeDefined();
    }
  });
});
