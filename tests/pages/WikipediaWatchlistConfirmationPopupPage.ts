import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaWatchlistConfirmationPopupPage extends BasePage {
    private readonly confirmButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.getByRole('group', { name: 'Remove from watchlist' }),
            'WikipediaWatchlistConfirmationPopupPage'
        );
        this.confirmButton = page.getByRole('button', { name: 'OK' }).describe('Remove from watchlist confirm button');
    }

    async clickConfirm(): Promise<void> {
        await this.confirmButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.formLocator.isVisible();
    }
}
