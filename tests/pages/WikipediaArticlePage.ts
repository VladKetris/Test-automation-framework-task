import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaArticlePage extends BasePage {
    private readonly articleTitle: Locator;
    private readonly articleContent: Locator;
    private readonly paragraphs: (index: number) => Locator;
    private readonly editButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('#ca-edit'),
            'WikipediaArticlePage'
        );
        this.articleTitle = page.locator('#firstHeading').describe('Article title heading');
        this.articleContent = page.locator('#mw-content-text').describe('Article content container');
        this.paragraphs = (index: number) => page.locator('#mw-content-text .mw-parser-output > p').nth(index).describe('Article paragraphs');
        this.editButton = page.locator('#ca-edit a').describe('Edit button');
    }

    async verifyArticleTitle(expectedTitle: string): Promise<void> {
        await this.elementToHaveText(this.articleTitle, expectedTitle);
    }

    async verifyArticleContainsText(expectedText: string): Promise<void> {
        await this.elementToContainText(this.articleContent, expectedText);
    }

    /**
     * Verify paragraph at specified index contains expected text
     * @param expectedText Expected text in paragraph
     * @param index Paragraph index (0-based, defaults to 0)
     */
    async verifyParagraphContainsText(expectedText: string, index: number = 0): Promise<void> {
        const paragraph = this.paragraphs(index);
        await this.elementToContainText(paragraph, expectedText);
    }

    async getArticleTitle(): Promise<string> {
        return this.articleTitle.innerText();
    }

    async getArticleContent(): Promise<string> {
        return this.articleContent.innerText();
    }

    async clickEdit(): Promise<void> {
        await this.editButton.click();
    }
}

