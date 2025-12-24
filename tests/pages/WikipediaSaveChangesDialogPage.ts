import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaSaveChangesDialogPage extends BasePage {
    private readonly editSummaryInput: Locator;
    private readonly publishButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.getByRole('dialog').filter({ hasText: 'Save your changes' }),
            'WikipediaSaveChangesDialogPage'
        );
        this.editSummaryInput = page.getByRole('combobox', { name: 'Describe what you changed' }).describe('Edit summary input');
        this.publishButton = page.getByRole('button', { name: /^Publish/ }).describe('Publish button in dialog');
    }

    async enterEditSummary(summary: string): Promise<void> {
        await this.editSummaryInput.fill(summary);
    }

    async clickPublish(): Promise<void> {
        await this.publishButton.click();
    }
}

