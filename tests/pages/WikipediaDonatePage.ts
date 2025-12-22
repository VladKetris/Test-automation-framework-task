import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaDonatePage extends BasePage {
    private readonly thankYouHeader: Locator;

    constructor(page: Page) {
        const thankYouHeader = page.locator('#Thank_you_for_your_interest').describe('Thank you header');
        super(page, thankYouHeader, 'WikipediaDonatePage');
        this.thankYouHeader = thankYouHeader;
    }

    async verifyThankYouHeaderDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.thankYouHeader);
    }
}
