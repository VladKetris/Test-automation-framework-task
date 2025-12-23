import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaDonatePage extends BasePage {
    private readonly thankYouHeader: Locator;

    constructor(page: Page) {
        super(page, page.locator('#Thank_you_for_your_interest'), 'WikipediaDonatePage');
        this.thankYouHeader = page.locator('#Thank_you_for_your_interest').describe('Thank you header');
    }

    /**
     * Verify thank you header is displayed
     */
    async verifyThankYouHeaderDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.thankYouHeader);
    }
}
