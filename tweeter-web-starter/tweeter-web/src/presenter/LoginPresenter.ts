import { AuthenticatePresenter, AuthenticateView } from "./AuthenticatePresenter";

export interface LoginView extends AuthenticateView {}

export class LoginPresenter extends AuthenticatePresenter<LoginView> {
    public constructor(view: LoginView) {
        super(view);
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        await this.doAuthenticationOperation(
            () => this.userService.login(alias, password),
            rememberMe,
            originalUrl
        );
    }

    protected getOperationDescription(): string {
        return "log user in";
    }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    }
}
