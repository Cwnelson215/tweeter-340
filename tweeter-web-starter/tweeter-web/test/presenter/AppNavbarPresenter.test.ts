import { AuthToken } from "tweeter-shared";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/AppNavbarPresenter";
import { UserService } from "../../src/model.service/UserService";
import {
  instance,
  mock,
  verify,
  spy,
  when,
  anything,
  capture,
} from "ts-mockito";

describe("AppNavbarPresenter", () => {
  let mockView: AppNavbarView;
  let presenter: AppNavbarPresenter;
  let mockUserService: UserService;
  const authToken = new AuthToken("test-token", Date.now());

  beforeEach(() => {
    mockView = mock<AppNavbarView>();

    const mockViewInstance = instance(mockView);

    // Make displayInfoMessage return a toast ID
    when(mockView.displayInfoMessage(anything(), anything())).thenReturn(
      "toast-id"
    );

    presenter = new AppNavbarPresenter(mockViewInstance);

    // Inject mock service
    mockUserService = mock(UserService);
    when(mockUserService.logout(anything())).thenResolve();
    (presenter as any)["userService"] = instance(mockUserService);
  });

  it("tells the view to display a logging out message", async () => {
    await presenter.logOut(authToken);

    verify(mockView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await presenter.logOut(authToken);

    verify(mockUserService.logout(authToken)).once();
  });

  it("tells the view to delete the info message, clear user info, and navigate to login on success", async () => {
    await presenter.logOut(authToken);

    verify(mockView.deleteMessage("toast-id")).once();
    verify(mockView.clearUserInfo()).once();
    verify(mockView.navigate("/login")).once();
  });

  it("displays an error message and does not clear/navigate on failure", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.logout(anything())).thenReject(error);

    await presenter.logOut(authToken);

    verify(
      mockView.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      )
    ).once();

    verify(mockView.deleteMessage(anything())).never();
    verify(mockView.clearUserInfo()).never();
    verify(mockView.navigate(anything())).never();
  });
});
