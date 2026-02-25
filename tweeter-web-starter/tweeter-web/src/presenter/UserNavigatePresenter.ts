import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigateView extends View {
    setDisplayedUser: (user: User) => void;
    getDisplayedUser: () => User;
    navigate: (url: string) => void;
}

export class UserNavigatePresenter extends Presenter<UserNavigateView> {
    private userService: UserService;

    public constructor(view: UserNavigateView) {
        super(view);
        this.userService = new UserService();
    }

    public async navigateToUser(authToken: AuthToken, targetString: string, featurePath: string) {
        await this.doFailureReportingOperation(async () => {
            const alias = this.extractAlias(targetString);

            const toUser = await this.userService.getUser(authToken!, alias);

            if (toUser) {
                if (!toUser.equals(this.view.getDisplayedUser())) {
                    this.view.setDisplayedUser(toUser);
                    this.view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        }, "get user");
    }

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    }
}
