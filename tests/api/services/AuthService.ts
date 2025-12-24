import { APIResponse } from '@playwright/test';
import { ApiClient } from '@utils/api-client';
import { AuthRoutes, MediaWikiActionRoutes } from '@api/routes';
import { GetAccessTokenRequestModel, GetAccessTokenRequest, GetCsrfTokenQueryParamsModel } from '@api/builders';
import { Headers, buildBearerAuthHeader } from '@api/constants';

export class AuthService {
    constructor(
        private readonly client: ApiClient,
        private readonly actionApiClient?: ApiClient
    ) { }

    /**
     * Get OAuth access token for Meta user
     * @returns Raw API response containing access token
     */
    async getMetaUserAccessToken(): Promise<APIResponse> {
        return this.getAccessToken(GetAccessTokenRequestModel.buildMetaUserRequestModel());
    }

    /**
     * Get CSRF token required for edit operations
     * @param accessToken OAuth access token
     * @returns Raw API response containing CSRF token
     */
    async getCsrfToken(accessToken: string): Promise<APIResponse> {
        const queryParams = GetCsrfTokenQueryParamsModel.buildQueryParams();
        const apiClient = this.actionApiClient || this.client;

        return apiClient.get(MediaWikiActionRoutes.API, {
            params: queryParams,
            headers: {
                [Headers.AUTHORIZATION]: buildBearerAuthHeader(accessToken)
            }
        });
    }

    private async getAccessToken(requestBody: Partial<GetAccessTokenRequest>): Promise<APIResponse> {
        return this.client.post(AuthRoutes.AUTH, {
            form: requestBody
        });
    }
}
