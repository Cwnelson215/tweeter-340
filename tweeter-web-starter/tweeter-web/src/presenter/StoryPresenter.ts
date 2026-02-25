import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { PagedItemPresenter, PagedItemView, PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends PagedItemPresenter<Status, StatusService> {
    public constructor(view: PagedItemView<Status>) {
        super(view, new StatusService());
    }

    protected async getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[Status[], boolean]> {
        return this.service.loadMoreStoryItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getItemDescription(): string {
        return "load story items";
    }
}
