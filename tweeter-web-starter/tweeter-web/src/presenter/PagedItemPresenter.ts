import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<T, S> extends Presenter<PagedItemView<T>> {
    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;
    private _service: S;
    private userService: UserService;

    protected constructor(view: PagedItemView<T>, service: S) {
        super(view);
        this._service = service;
        this.userService = new UserService();
    }

    protected get service(): S {
        return this._service;
    }

    protected get lastItem(): T | null {
        return this._lastItem;
    }

    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    reset(): void {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser(authToken: AuthToken, alias: string) {
        return this.userService.getUser(authToken, alias);
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
        await this.doFailureReportingOperation(async () => {
            const [newItems, hasMore] = await this.getMoreItems(
                authToken,
                userAlias
            );

            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, this.getItemDescription());
    }

    protected abstract getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[T[], boolean]>;

    protected abstract getItemDescription(): string;
}
