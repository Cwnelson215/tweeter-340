import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService;

    public constructor(view: UserInfoView) {
        super(view);
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        await this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        }, "determine follower status");
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.doFailureReportingOperation(async () => {
            this.view.setFolloweeCount(
                await this.followService.getFolloweeCount(authToken, displayedUser)
            );
        }, "get followees count");
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.doFailureReportingOperation(async () => {
            this.view.setFollowerCount(
                await this.followService.getFollowerCount(authToken, displayedUser)
            );
        }, "get followers count");
    }

    public async followDisplayedUser(
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        await this.doFollowOperation(
            authToken,
            displayedUser,
            () => this.followService.follow(authToken!, displayedUser!),
            `Following ${displayedUser!.name}...`,
            true,
            "follow user"
        );
    }

    public async unfollowDisplayedUser(
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        await this.doFollowOperation(
            authToken,
            displayedUser,
            () => this.followService.unfollow(authToken!, displayedUser!),
            `Unfollowing ${displayedUser!.name}...`,
            false,
            "unfollow user"
        );
    }

    private async doFollowOperation(
        authToken: AuthToken,
        displayedUser: User,
        operation: () => Promise<[number, number]>,
        toastMessage: string,
        isFollowerResult: boolean,
        operationDescription: string
    ): Promise<void> {
        var toastId = "";

        try {
            this.view.setIsLoading(true);
            toastId = this.view.displayInfoMessage(toastMessage, 0);

            const [followerCount, followeeCount] = await operation();

            this.view.setIsFollower(isFollowerResult);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${operationDescription} because of exception: ${error}`
            );
        } finally {
            this.view.deleteMessage(toastId);
            this.view.setIsLoading(false);
        }
    }
}
