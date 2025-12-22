import { test } from '@fixtures/api.fixture';
import { expect } from '@playwright/test';
import { StatusCode } from '@api/constants';
import { assertSchema } from '@utils/parse-response';
import { AccessTokenSchema } from '@api/schemas';
import { getRandomArticle } from '@utils/test-data-provider';

test.describe('Wikipedia Auth API Tests', () => {

    test('Verify get access token returns valid token response', async ({ authService }) => {
        const response = await authService.getMetaUserAccessToken();

        await expect(response).toHaveStatusCode(StatusCode.OK);

        await assertSchema(response, AccessTokenSchema, 'Access Token Response');
    });

    test('Verify access token can be used for authenticated requests', async ({ authService, pageService }) => {
        const TEST_PAGE_TITLE = getRandomArticle();
        
        const authResponse = await authService.getMetaUserAccessToken();
        await expect(authResponse).toHaveStatusCode(StatusCode.OK);
        
        const authData = await assertSchema(authResponse, AccessTokenSchema, 'Access Token Response');
        const accessToken = authData.access_token;

        const pageResponse = await pageService.getBarePage(TEST_PAGE_TITLE, accessToken);

        await expect(pageResponse).toHaveStatusCode(StatusCode.OK);
    });
});
