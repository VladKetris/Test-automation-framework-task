import { APIResponse } from '@playwright/test';
import { ApiClient } from '@utils/api-client';
import { PageRoutes } from '@api/routes';
import { Headers, buildBearerAuthHeader } from '@api/constants';

export class PageService {
    constructor(private readonly client: ApiClient) { }

    /**
     * Get page content (bare)
     * @param title Page title
     * @param accessToken Optional access token for authenticated request
     */
    async getBarePage(title: string, accessToken?: string): Promise<APIResponse> {
        const options = accessToken ? {
            headers: {
                [Headers.AUTHORIZATION]: buildBearerAuthHeader(accessToken)
            }
        } : undefined;

        return this.client.get(PageRoutes.GET_BARE(title), options);
    }
}
