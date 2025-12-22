import { step } from '@utils/decorators';
import { AuthService, PageService } from '@api/services';
import { expect } from '@playwright/test';
import { StatusCode } from '@api/constants';
import { assertSchema } from '@utils/parse-response';
import { AccessTokenSchema, CsrfTokenSchema } from '@api/schemas';

export class WikipediaAuthApiSteps {
    constructor(
        private readonly authService: AuthService,
        private readonly pageService: PageService
    ) { }

    /**
     * Get OAuth access token for authenticated API requests
     * @returns Access token string
     */
    @step('Get OAuth access token')
    async getAccessToken(): Promise<string> {
        const authResponse = await this.authService.getMetaUserAccessToken();
        await expect(authResponse).toHaveStatusCode(StatusCode.OK);
        const authData = await assertSchema(authResponse, AccessTokenSchema, 'Access Token Response');
        return authData.access_token;
    }

    /**
     * Get CSRF token for MediaWiki edit operations
     * @param accessToken OAuth access token
     * @returns CSRF token string
     */
    @step('Get CSRF token for edit operations')
    async getCsrfToken(accessToken: string): Promise<string> {
        const csrfResponse = await this.authService.getCsrfToken(accessToken);
        await expect(csrfResponse).toHaveStatusCode(StatusCode.OK);
        const csrfData = await assertSchema(csrfResponse, CsrfTokenSchema, 'CSRF Token Response');
        return csrfData.query.tokens.csrftoken;
    }

    /**
     * Get both access token and CSRF token for authenticated API operations
     * @returns Object containing accessToken and csrfToken
     */
    @step('Get authentication tokens for API operations')
    async getAuthTokens(): Promise<{ accessToken: string; csrfToken: string }> {
        const accessToken = await this.getAccessToken();
        const csrfToken = await this.getCsrfToken(accessToken);
        return { accessToken, csrfToken };
    }
}

