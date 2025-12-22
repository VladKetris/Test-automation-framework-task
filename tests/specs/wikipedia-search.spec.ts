import { test } from '@fixtures';
import { getRandomArticle } from '@utils/test-data-provider';

test.describe('Wikipedia Search', () => {

    test('Search opens an article from navigation search', async ({
        wikipediaMainSteps,
        wikipediaSearchSteps
    }) => {
        const articleTitle = getRandomArticle();

        await wikipediaMainSteps.openDirectlyAndVerify();
        await wikipediaSearchSteps.searchForArticle(articleTitle);
        await wikipediaSearchSteps.verifyArticlePageDisplayed(articleTitle);
    });

});

