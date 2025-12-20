import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { getEnvironment } from '@utils/config';

export class WikipediaMainPage extends BasePage {
    constructor(page: Page) {
        super(page, page.locator('//div[contains(@class, "ve-init-mw-desktopArticleTarget-targetContainer")]'), 'WikipediaMainPage');
    }

    /**
     * Navigate to Wikipedia main page
     */
    async navigate(): Promise<void> {
        await this.page.goto(getEnvironment().wikipedia.mainPageUrl);
    }
}
