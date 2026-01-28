import { User, AuthToken } from "tweeter-shared";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useContext } from "react";


interface UserInfoActions {
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void,
    clearUserInfo: () => void,
    setDisplayedUser: (user: User) => void,
}

export const useUserInfoActions = (): UserInfoActions => {
    return useContext(UserInfoActionsContext);
}

export const useUserInfo = () => {
    return useContext(UserInfoContext);
}