import { test } from '@fixtures/api.fixture';
import { expect } from '@playwright/test';
import { StatusCode } from '@api/constants';
import { assertSchema } from '@utils/parse-response';
import { PageBareWithTitleSchema, AccessTokenSchema } from '@api/schemas';
import { getRandomArticle, getAllArticles } from '@utils/test-data-provider';
import { randomString } from '@utils/test-data-generator';

test.describe('Wikipedia Page API Tests', () => {

    test('Verify get page content returns valid page data', async ({ pageService }) => {
        const PAGE_TITLE = getRandomArticle();

        const response = await pageService.getBarePage(PAGE_TITLE);

        await expect(response).toHaveStatusCode(StatusCode.OK);
        
        const schema = PageBareWithTitleSchema(PAGE_TITLE);
        await assertSchema(response, schema, 'Page Bare Response');
    });

    test('Verify get page content for non-existent page returns 404', async ({ pageService }) => {
        const NON_EXISTENT_PAGE = `NonExistentPage${randomString()}`;

        const response = await pageService.getBarePage(NON_EXISTENT_PAGE);

        await expect(response).toHaveStatusCode(StatusCode.NOT_FOUND);
    });

    test('Verify get page content with authenticated request', async ({ pageService, authService }) => {
        const PAGE_TITLE = getRandomArticle();
        
        const authResponse = await authService.getMetaUserAccessToken();
        await expect(authResponse).toHaveStatusCode(StatusCode.OK);
        
        const authData = await assertSchema(authResponse, AccessTokenSchema, 'Access Token Response');
        const accessToken = authData.access_token;

        const response = await pageService.getBarePage(PAGE_TITLE, accessToken);

        await expect(response).toHaveStatusCode(StatusCode.OK);

        const schema = PageBareWithTitleSchema(PAGE_TITLE);
        await assertSchema(response, schema, 'Page Bare Response');
    });

    test('Verify page response structure for multiple articles', async ({ pageService }) => {
        const ARTICLES_TO_TEST = getAllArticles();

        for (const articleTitle of ARTICLES_TO_TEST) {
            const response = await pageService.getBarePage(articleTitle);

            await expect(response).toHaveStatusCode(StatusCode.OK);

            const schema = PageBareWithTitleSchema(articleTitle);
            await assertSchema(response, schema, `Page Bare Response for ${articleTitle}`);
        }
    });
});
