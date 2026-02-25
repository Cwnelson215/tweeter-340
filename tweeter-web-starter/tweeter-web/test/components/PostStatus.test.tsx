import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { instance, mock } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";

// Mock useUserInfo to return a current user and auth token
const mockAuthToken = new AuthToken("test-token", Date.now());
const mockUser = new User("first", "last", "@testuser", "http://image.url");

jest.mock("../../src/components/userInfo/UserHooks", () => ({
  useUserInfo: () => ({
    currentUser: mockUser,
    authToken: mockAuthToken,
  }),
  useUserInfoActions: () => ({
    updateUserInfo: jest.fn(),
    clearUserInfo: jest.fn(),
    setDisplayedUser: jest.fn(),
  }),
}));

jest.mock("../../src/components/toaster/MessageHooks", () => ({
  useMessageActions: () => ({
    displayErrorMessage: jest.fn(),
    displayInfoMessage: jest.fn(),
    deleteMessage: jest.fn(),
  }),
}));

// Mock PostStatusPresenter
const mockPresenter = mock(PostStatusPresenter);
const mockPresenterInstance = instance(mockPresenter);

jest.mock("../../src/presenter/PostStatusPresenter", () => {
  const original = jest.requireActual(
    "../../src/presenter/PostStatusPresenter"
  );
  return {
    ...original,
    PostStatusPresenter: jest
      .fn()
      .mockImplementation(() => mockPresenterInstance),
  };
});

describe("PostStatus Component", () => {
  beforeEach(() => {
    (mockPresenterInstance.checkButtonStatus as jest.Mock) = jest
      .fn()
      .mockImplementation(
        (post: string, authToken: any, currentUser: any) =>
          !post.trim() || !authToken || !currentUser
      );
  });

  it("Post Status and Clear buttons are disabled on initial render", () => {
    render(<PostStatus />);
    const postButton = screen.getByRole("button", { name: /post status/i });
    const clearButton = screen.getByRole("button", { name: /clear/i });

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("both buttons are enabled when the text field has text", async () => {
    render(<PostStatus />);
    const textArea = screen.getByPlaceholderText("What's on your mind?");
    const postButton = screen.getByRole("button", { name: /post status/i });
    const clearButton = screen.getByRole("button", { name: /clear/i });

    await userEvent.type(textArea, "Hello world!");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("both buttons are disabled when the text field is cleared", async () => {
    render(<PostStatus />);
    const textArea = screen.getByPlaceholderText("What's on your mind?");
    const postButton = screen.getByRole("button", { name: /post status/i });
    const clearButton = screen.getByRole("button", { name: /clear/i });

    await userEvent.type(textArea, "Hello world!");
    expect(postButton).toBeEnabled();

    await userEvent.clear(textArea);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's submitPost with correct params when Post Status is pressed", async () => {
    (mockPresenterInstance.submitPost as jest.Mock) = jest
      .fn()
      .mockResolvedValue(undefined);

    render(<PostStatus />);
    const textArea = screen.getByPlaceholderText("What's on your mind?");
    const postButton = screen.getByRole("button", { name: /post status/i });

    await userEvent.type(textArea, "Hello world!");
    await userEvent.click(postButton);

    expect(mockPresenterInstance.submitPost).toHaveBeenCalledWith(
      mockAuthToken,
      mockUser,
      "Hello world!"
    );
  });
});
