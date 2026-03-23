import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';

const ARTICLE_TITLE = 'Wikipedia';

test.describe('Wikipedia Watchlist', () => {

    test('Add article to watchlist and remove it', async ({
        wikipediaAuthSteps,
        wikipediaSearchSteps,
        wikipediaWatchlistSteps
    }) => {

        await wikipediaAuthSteps.authenticateUser(getWikipediaCredentials());
        await wikipediaSearchSteps.searchForArticle(ARTICLE_TITLE);
        await wikipediaSearchSteps.verifyArticlePageDisplayed(ARTICLE_TITLE);
        await wikipediaWatchlistSteps.ensureArticleIsNotWatched();
        await wikipediaWatchlistSteps.addCurrentArticleToWatchlist();
        await wikipediaWatchlistSteps.removeCurrentArticleFromWatchlist();
    });

});
