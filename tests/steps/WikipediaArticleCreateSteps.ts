import { WikipediaCreatePagePage } from '@pages/WikipediaCreatePagePage';
import { WikipediaNavigationMenu } from '@pages/WikipediaNavigationMenu';
import { step } from '@utils/decorators';

export class WikipediaArticleCreateSteps {
    constructor(
        private readonly createPagePage: WikipediaCreatePagePage,
        private readonly navigationMenu: WikipediaNavigationMenu
    ) {}

    @step('Navigate to create new page')
    async navigateToCreateNewPage(): Promise<void> {
        await this.navigationMenu.clickCreateNewPageInSidebar();
    }

    @step('Create new page with title "{0}"')
    async createNewPageWithTitle(pageTitle: string): Promise<void> {
        await this.createPagePage.verifyPageOpened();
        await this.createPagePage.enterPageTitle(pageTitle);
        await this.createPagePage.clickCreateNewPage();
    }
}

