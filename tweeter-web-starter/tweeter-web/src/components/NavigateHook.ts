import { useNavigate } from "react-router-dom";
import { useMessageActions } from "./toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserHooks";
import { UserNavigatePresenter, UserNavigateView } from "../presenter/UserNavigatePresenter";
import { useState } from "react";

export const useUserNavigate = () => {
    const { displayErrorMessage } = useMessageActions();
    const {setDisplayedUser } = useUserInfoActions();
    const { displayedUser, authToken } = useUserInfo();
    const navigate = useNavigate();

    const listener: UserNavigateView = {
        displayErrorMessage: displayErrorMessage,
        setDisplayedUser: setDisplayedUser,
        getDisplayedUser: () => displayedUser!,
        navigate: navigate,
    };

    const [presenter] = useState(() => new UserNavigatePresenter(listener));

    const navigateToUser = async (event: React.MouseEvent, featurePath: string): Promise<void> => {
        event.preventDefault();
        presenter.navigateToUser(authToken!, event.target.toString(), featurePath);
    };

    return { navigateToUser };
};
