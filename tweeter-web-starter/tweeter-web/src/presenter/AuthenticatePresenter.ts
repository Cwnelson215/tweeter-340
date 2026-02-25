import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthenticateView extends View {
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, remember: boolean) => void;
    navigate: (url: string) => void;
}

export abstract class AuthenticatePresenter<V extends AuthenticateView> extends Presenter<V> {
    private _userService: UserService;

    protected constructor(view: V) {
        super(view);
        this._userService = new UserService();
    }

    protected get userService(): UserService {
        return this._userService;
    }

    protected async doAuthenticationOperation(
        operation: () => Promise<[User, AuthToken]>,
        rememberMe: boolean,
        navigateTo?: string
    ): Promise<void> {
        await this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);

            try {
                const [user, authToken] = await operation();

                this.view.updateUserInfo(user, user, authToken, rememberMe);

                if (navigateTo) {
                    this.view.navigate(navigateTo);
                } else {
                    this.view.navigate(`/feed/${user.alias}`);
                }
            } finally {
                this.view.setIsLoading(false);
            }
        }, this.getOperationDescription());
    }

    protected abstract getOperationDescription(): string;
}
