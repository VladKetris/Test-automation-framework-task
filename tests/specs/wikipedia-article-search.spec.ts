import { test } from '@fixtures/api.fixture';
import { expect } from '@playwright/test';
import { StatusCode } from '@api/constants';
import { assertSchema } from '@utils/parse-response';
import { PageEditSuccessSchema } from '@api/schemas';
import { createArticleTitle, randomParagraph, randomEditSummary } from '@utils/test-data-generator';

test.describe('Wikipedia Article Creation and Search', () => {

    test('Create article via API and find it via UI search', async ({
        wikipediaAuthApiSteps,
        pageService,
        wikipediaMainPage,
        wikipediaNavigationMenu,
        wikipediaArticlePage,
    }) => {
        const { pageTitle, headerTitle } = createArticleTitle();
        const ARTICLE_CONTENT = randomParagraph();

        const { accessToken, csrfToken } = await wikipediaAuthApiSteps.getAuthTokens();

        const EDIT_SUMMARY = randomEditSummary();
        
        const createResponse = await pageService.createPage(
            pageTitle,
            ARTICLE_CONTENT,
            csrfToken,
            accessToken,
            EDIT_SUMMARY
        );
        await expect(createResponse).toHaveStatusCode(StatusCode.OK);
        await assertSchema(createResponse, PageEditSuccessSchema, 'Page Edit Response');

        await wikipediaMainPage.navigate();
        await wikipediaMainPage.verifyPageOpened();

        await wikipediaNavigationMenu.enterSearchText(pageTitle);
        await wikipediaNavigationMenu.clickSearch();

        await wikipediaArticlePage.verifyPageOpened();
        await wikipediaArticlePage.verifyArticleTitle(headerTitle);
        await wikipediaArticlePage.verifyArticleContainsText(ARTICLE_CONTENT);
    });

});

