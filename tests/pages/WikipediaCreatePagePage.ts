import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaCreatePagePage extends BasePage {
    private readonly pageTitleInput: Locator;
    private readonly createButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.getByRole('heading', { name: 'Wikipedia:Create a new page' }),
            'WikipediaCreatePagePage'
        );
        this.pageTitleInput = page.getByRole('textbox').describe('Page title input');
        this.createButton = page.getByRole('button', { name: 'Create a new page' }).describe('Create a new page button');
    }

    async enterPageTitle(title: string): Promise<void> {
        await this.elementToBeVisible(this.pageTitleInput);
        await this.pageTitleInput.fill(title);
    }

    async clickCreateNewPage(): Promise<void> {
        await this.elementToBeVisible(this.createButton);
        await this.createButton.click();
    }
}

