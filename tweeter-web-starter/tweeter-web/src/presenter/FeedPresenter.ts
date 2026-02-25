import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { PagedItemPresenter, PagedItemView, PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends PagedItemPresenter<Status, StatusService> {
    public constructor(view: PagedItemView<Status>) {
        super(view, new StatusService());
    }

    protected async getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getItemDescription(): string {
        return "load feed items";
    }
}
