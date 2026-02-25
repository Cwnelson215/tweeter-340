import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { PagedItemPresenter, PagedItemView, PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends PagedItemPresenter<User, FollowService> {
    public constructor(view: PagedItemView<User>) {
        super(view, new FollowService());
    }

    protected async getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[User[], boolean]> {
        return this.service.loadMoreFollowers(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getItemDescription(): string {
        return "load followers";
    }
}
