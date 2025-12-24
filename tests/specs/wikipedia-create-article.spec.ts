import { test } from '@fixtures';
import { createArticleTitle, randomSentence, randomEditSummary } from '@utils/test-data-generator';
import { getWikipediaCredentials } from '@utils/secrets';

test.describe('Wikipedia Create New Article (VisualEditor)', () => {

    test('Create new article as logged-in user', async ({
        wikipediaAuthSteps,
        wikipediaArticleCreateSteps,
        wikipediaVisualEditorPage,
        wikipediaArticleEditSteps,
        wikipediaArticlePage
    }) => {
        await wikipediaAuthSteps.authenticateUser(getWikipediaCredentials());

        const { pageTitle, headerTitle } = createArticleTitle();
        const content = randomSentence();
        const editSummary = randomEditSummary();

        await wikipediaArticleCreateSteps.navigateToCreateNewPage();
        await wikipediaArticleCreateSteps.createNewPageWithTitle(pageTitle);
        await wikipediaVisualEditorPage.verifyPageOpened();
        await wikipediaVisualEditorPage.verifyPublishButtonDisabled();
        await wikipediaVisualEditorPage.verifyHeadingContains(headerTitle);
        await wikipediaVisualEditorPage.enterContentLine(content);
        await wikipediaVisualEditorPage.clickPublish();
        await wikipediaArticleEditSteps.saveChangesWithSummary(editSummary);
        await wikipediaArticlePage.verifyPageOpened();
        await wikipediaArticlePage.verifyArticleTitle(headerTitle);
        await wikipediaArticlePage.verifyArticleContainsText(content);
    });

});

