import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigateView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
    getDisplayedUser: () => User;
    navigate: (url: string) => void;
}

export class UserNavigatePresenter {
    private _view: UserNavigateView;
    private userService: UserService;

    public constructor(view: UserNavigateView) {
        this._view = view;
        this.userService = new UserService();
    }

    public async navigateToUser(authToken: AuthToken, targetString: string, featurePath: string) {
        try {
            const alias = this.extractAlias(targetString);

            const toUser = await this.userService.getUser(authToken!, alias);

            if (toUser) {
                if (!toUser.equals(this._view.getDisplayedUser())) {
                    this._view.setDisplayedUser(toUser);
                    this._view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get user because of exception: ${error}`
            );
        }
    }

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    }
}
