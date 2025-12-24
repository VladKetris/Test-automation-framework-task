import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaVisualEditorPage extends BasePage {
    private readonly heading: Locator;
    private readonly editorTextbox: Locator;
    private readonly publishButton: Locator;

    constructor(page: Page) {
        const editorTextbox = page.locator('div.ve-ce-documentNode[contenteditable="true"][role="textbox"]')
            .describe('VisualEditor content area');

        super(page, editorTextbox, 'WikipediaVisualEditorPage');

        this.heading = page.getByRole('heading', { level: 1 }).describe('Editor page heading');
        this.editorTextbox = editorTextbox;
        this.publishButton = page.getByRole('button', { name: /Publish (page|changes)/i }).describe('Publish (page/changes) button');
    }

    async verifyHeadingContains(expectedTitle: string): Promise<void> {
        await this.elementToBeVisible(this.heading);
        await this.elementToContainText(this.heading, expectedTitle);
    }

    async verifyPublishButtonDisabled(): Promise<void> {
        await this.elementToBeVisible(this.publishButton);
        await this.elementToBeDisabled(this.publishButton);
    }

    async enterContentLine(content: string): Promise<void> {
        await this.elementToBeVisible(this.editorTextbox);
        await this.editorTextbox.click();
        await this.page.keyboard.type(content);
    }

    async replaceContentWith(content: string): Promise<void> {
        await this.elementToBeVisible(this.editorTextbox);
        await this.editorTextbox.click();

        const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
        await this.page.keyboard.press(`${modifier}+A`);
        await this.page.keyboard.press('Backspace');
        await this.page.keyboard.type(content);
    }

    async clickPublish(): Promise<void> {
        await this.elementToBeEnabled(this.publishButton);
        await this.publishButton.click();
    }
}

