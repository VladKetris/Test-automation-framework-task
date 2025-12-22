import { test } from '@fixtures';
import { getEditableArticle } from '@utils/test-data-provider';
import { randomSentence, randomEditSummary } from '@utils/test-data-generator';
import { getWikipediaCredentials } from '@utils/secrets';

test.describe('Wikipedia Edit Existing Article (VisualEditor)', () => {

    test('Edit existing test article', async ({
        wikipediaAuthSteps, 
        wikipediaSearchSteps,
        wikipediaArticleEditSteps,
        wikipediaArticlePage
    }) => {
        const { username, password } = getWikipediaCredentials();
        await wikipediaAuthSteps.authenticateUser(username, password);

        const articleTitle = getEditableArticle();
        const newContent = randomSentence();
        const editSummary = randomEditSummary();

        await wikipediaSearchSteps.searchForArticle(articleTitle);
        await wikipediaSearchSteps.verifyArticlePageDisplayed(articleTitle);
        await wikipediaArticlePage.clickEdit();
        await wikipediaArticleEditSteps.editContentAndPublish(newContent);
        await wikipediaArticleEditSteps.saveChangesWithSummary(editSummary);
        await wikipediaSearchSteps.verifyArticlePageDisplayed(articleTitle);
        await wikipediaArticlePage.verifyArticleContainsText(newContent);
    });

});

