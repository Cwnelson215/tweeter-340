import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model.service/StatusService";
import { instance, mock, verify, when, anything } from "ts-mockito";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("test-token", Date.now());
  const currentUser = new User("first", "last", "@testuser", "http://image.url");
  const postText = "Hello world!";

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const mockViewInstance = instance(mockView);

    when(mockView.displayInfoMessage(anything(), anything())).thenReturn(
      "toast-id"
    );

    presenter = new PostStatusPresenter(mockViewInstance);

    mockStatusService = mock(StatusService);
    when(mockStatusService.postStatus(anything(), anything())).thenResolve();
    (presenter as any)["statusService"] = instance(mockStatusService);
  });

  it("tells the view to display a posting status message", async () => {
    await presenter.submitPost(authToken, currentUser, postText);

    verify(mockView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the status service with the correct auth token and status", async () => {
    await presenter.submitPost(authToken, currentUser, postText);

    verify(mockStatusService.postStatus(authToken, anything())).once();
  });

  it("on success: clears the post, displays success message, and deletes loading message", async () => {
    await presenter.submitPost(authToken, currentUser, postText);

    verify(mockView.setPost("")).once();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockView.deleteMessage("toast-id")).once();
    verify(mockView.setIsLoading(false)).once();
  });

  it("on failure: displays error message and does not set post or display success", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(anything(), anything())).thenReject(
      error
    );

    await presenter.submitPost(authToken, currentUser, postText);

    verify(
      mockView.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      )
    ).once();

    // deleteMessage and setIsLoading(false) are in the finally block, so they are still called
    verify(mockView.deleteMessage("toast-id")).once();
    verify(mockView.setIsLoading(false)).once();

    // But setPost("") and "Status posted!" should NOT be called
    verify(mockView.setPost("")).never();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
