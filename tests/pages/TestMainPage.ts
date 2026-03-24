import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { getTestEnvironment } from '@utils/config';

export class TestMainPage extends BasePage {
    constructor(page: Page) {
        super(page, page.locator('//div[@class="item active"]//img[@alt="demo website for practice"]'), 'TestMainPage');
    }

    /**
     * Navigate to Test main page
     */
    async navigate(): Promise<void> {
        await this.page.goto(getTestEnvironment().testSite.mainPageUrl);
    }
}
