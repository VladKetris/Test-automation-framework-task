import { WikipediaArticlePage } from '@pages/WikipediaArticlePage';
import { WikipediaWatchlistConfirmationPopupPage } from '@pages/WikipediaWatchlistConfirmationPopupPage';
import { step } from '@utils/decorators';

export class WikipediaWatchlistSteps {
    constructor(
        private readonly articlePage: WikipediaArticlePage,
        private readonly watchlistConfirmationPopupPage: WikipediaWatchlistConfirmationPopupPage
    ) {}

    @step('Ensure article is not in watchlist')
    async ensureArticleIsNotWatched(): Promise<void> {
        if (await this.articlePage.isUnwatchButtonVisible()) {
            await this.articlePage.clickUnwatch();
        }

        await this.articlePage.verifyWatchButtonDisplayed();
    }

    @step('Add current article to watchlist')
    async addCurrentArticleToWatchlist(): Promise<void> {
        await this.articlePage.verifyWatchButtonDisplayed();
        await this.articlePage.clickWatch();
        await this.articlePage.verifyUnwatchButtonDisplayed();
    }

    @step('Remove current article from watchlist')
    async removeCurrentArticleFromWatchlist(): Promise<void> {
        await this.articlePage.verifyUnwatchButtonDisplayed();
        await this.articlePage.clickUnwatch();

        if (await this.watchlistConfirmationPopupPage.isVisible()) {
            await this.watchlistConfirmationPopupPage.clickConfirm();
        }

        await this.articlePage.verifyWatchButtonDisplayed();
    }
}
