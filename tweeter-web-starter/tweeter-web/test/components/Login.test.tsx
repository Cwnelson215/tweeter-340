import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "../../src/components/authentication/login/Login";
import { LoginPresenter } from "../../src/presenter/LoginPresenter";
import { instance, mock, verify, anything } from "ts-mockito";
import { MemoryRouter } from "react-router-dom";

// Mock the hooks
jest.mock("../../src/components/userInfo/UserHooks", () => ({
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

// Mock the LoginPresenter
const mockPresenter = mock(LoginPresenter);
const mockPresenterInstance = instance(mockPresenter);

jest.mock("../../src/presenter/LoginPresenter", () => {
  const original = jest.requireActual("../../src/presenter/LoginPresenter");
  return {
    ...original,
    LoginPresenter: jest.fn().mockImplementation(() => mockPresenterInstance),
  };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login Component", () => {
  beforeEach(() => {
    // Reset the checkSubmitButtonStatus mock for each test
    (mockPresenterInstance.checkSubmitButtonStatus as jest.Mock) = jest
      .fn()
      .mockImplementation(
        (alias: string, password: string) => !alias || !password
      );
  });

  it("sign-in button is disabled on initial render", () => {
    renderLogin();
    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).toBeDisabled();
  });

  it("sign-in button is enabled when both alias and password have text", async () => {
    renderLogin();
    const aliasInput = screen.getByLabelText("Alias");
    const passwordInput = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(aliasInput, "@testuser");
    await userEvent.type(passwordInput, "password123");

    expect(button).toBeEnabled();
  });

  it("sign-in button is disabled if either field is cleared", async () => {
    renderLogin();
    const aliasInput = screen.getByLabelText("Alias");
    const passwordInput = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(aliasInput, "@testuser");
    await userEvent.type(passwordInput, "password123");
    expect(button).toBeEnabled();

    await userEvent.clear(passwordInput);
    expect(button).toBeDisabled();

    await userEvent.type(passwordInput, "password123");

    await userEvent.clear(aliasInput);
    expect(button).toBeDisabled();
  });

  it("calls the presenter's doLogin method with correct parameters when sign-in is pressed", async () => {
    (mockPresenterInstance.doLogin as jest.Mock) = jest
      .fn()
      .mockResolvedValue(undefined);

    renderLogin();
    const aliasInput = screen.getByLabelText("Alias");
    const passwordInput = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(aliasInput, "@testuser");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(button);

    expect(mockPresenterInstance.doLogin).toHaveBeenCalledWith(
      "@testuser",
      "password123",
      false,
      undefined
    );
  });
});
