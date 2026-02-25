import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import { PagedItemPresenter, PagedItemView } from "../../presenter/PagedItemPresenter";

interface Props<T, S> {
    featureUrl: string;
    presenterFactory: (view: PagedItemView<T>) => PagedItemPresenter<T, S>;
    itemComponentGenerator: (item: T, index: number) => JSX.Element;
}

function ItemScroller<T, S>(props: Props<T, S>) {
    const { displayErrorMessage } = useMessageActions();
    const [items, setItems] = useState<T[]>([]);

    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const { displayedUser: displayedUserAliasParam } = useParams();

    const listener: PagedItemView<T> = {
        addItems: (newItems: T[]) =>
        setItems((previousItems) => [...previousItems, ...newItems]),
        displayErrorMessage: displayErrorMessage
    }

    const presenterRef = useRef<PagedItemPresenter<T, S> | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = props.presenterFactory(listener);
    }

    useEffect(() => {
    if (
        authToken &&
        displayedUserAliasParam &&
        displayedUserAliasParam != displayedUser!.alias
    ) {
        presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
            setDisplayedUser(toUser);
        }
        });
    }
    }, [displayedUserAliasParam]);

    useEffect(() => {
        reset();
        loadMoreItems();
    }, [displayedUser]);

    const reset = async () => {
        setItems(() => []);
        presenterRef.current!.reset();
    };

    const loadMoreItems = async () => {
        presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
    };

    return (
    <div className="container px-0 overflow-visible vh-100">
        <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems ?? false}
        loader={<h4>Loading...</h4>}
        >
        {items.map((item, index) => (
            <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
            >
            {props.itemComponentGenerator(item, index)}
            </div>
        ))}
        </InfiniteScroll>
    </div>
    );
}

export default ItemScroller;
