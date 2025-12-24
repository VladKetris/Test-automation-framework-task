import { APIResponse } from '@playwright/test';
import { ApiClient } from '@utils/api-client';
import { PageRoutes, MediaWikiActionRoutes } from '@api/routes';
import { Headers, buildBearerAuthHeader } from '@api/constants';
import { CreatePageRequestModel, EditPageQueryParamsModel } from '@api/builders';

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

    /**
     * Create or edit a Wikipedia page
     * @param title Page title
     * @param content Page content (wikitext)
     * @param csrfToken CSRF token from AuthService.getCsrfToken()
     * @param accessToken OAuth access token
     * @param summary Optional edit summary
     * @returns Raw API response
     */
    async createPage(
        title: string,
        content: string,
        csrfToken: string,
        accessToken: string,
        summary?: string
    ): Promise<APIResponse> {
        const formData = CreatePageRequestModel.buildCreatePageRequestModel(
            title,
            content,
            csrfToken,
            summary
        );
        const queryParams = EditPageQueryParamsModel.buildQueryParams();

        return this.client.post(MediaWikiActionRoutes.API, {
            params: queryParams,
            form: formData,
            headers: {
                [Headers.AUTHORIZATION]: buildBearerAuthHeader(accessToken)
            }
        });
    }
}
