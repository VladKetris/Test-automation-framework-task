import { WikipediaNavigationMenu } from '@pages/WikipediaNavigationMenu';
import { WikipediaArticlePage } from '@pages/WikipediaArticlePage';
import { step } from '@utils/decorators';

export class WikipediaSearchSteps {
    constructor(
        private readonly navigationMenu: WikipediaNavigationMenu,
        private readonly articlePage: WikipediaArticlePage
    ) {}

    @step('Search for article "{0}" from navigation menu')
    async searchForArticle(articleTitle: string): Promise<void> {
        await this.navigationMenu.enterSearchText(articleTitle);
        await this.navigationMenu.clickSearch();
    }

    @step('Verify article page with title "{0}" is displayed')
    async verifyArticlePageDisplayed(articleTitle: string): Promise<void> {
        await this.articlePage.verifyPageOpened();
        await this.articlePage.verifyArticleTitle(articleTitle);
    }
}

