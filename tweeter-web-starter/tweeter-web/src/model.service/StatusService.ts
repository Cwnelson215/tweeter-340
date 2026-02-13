import { AuthToken, Status } from "tweeter-shared";

export class StatusService {
    static PAGE_SIZE = 10;

    static async loadMoreStatuses (
        authToken: AuthToken,
        userAlias: string,
        lastStatus: Status | null
    ): Promise<[Status[], boolean]> {
        const response = await fetch(
            `/api/statuses?userAlias=${userAlias}&lastStatusId=${lastStatus || ''}&pageSize=${this.PAGE_SIZE}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken.token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to load statuses: ${response.statusText}`);
        }

        const data = await response.json();
        return [data.statuses, data.hasMore];
    }

}