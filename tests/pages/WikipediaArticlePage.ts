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

    /**
     * Verify article title matches expected text
     * @param expectedTitle Expected article title
     */
    async verifyArticleTitle(expectedTitle: string): Promise<void> {
        await this.elementToBeVisible(this.articleTitle);
        await this.elementToHaveText(this.articleTitle, expectedTitle);
    }

    /**
     * Verify article content contains expected text
     * @param expectedText Expected text in article content
     */
    async verifyArticleContainsText(expectedText: string): Promise<void> {
        await this.elementToBeVisible(this.articleContent);
        await this.elementToContainText(this.articleContent, expectedText);
    }

    /**
     * Verify paragraph at specified index contains expected text
     * @param expectedText Expected text in paragraph
     * @param index Paragraph index (0-based, defaults to 0 for first paragraph)
     */
    async verifyParagraphContainsText(expectedText: string, index: number = 0): Promise<void> {
        const paragraph = this.paragraphs(index);
        await this.elementToBeVisible(paragraph);
        await this.elementToContainText(paragraph, expectedText);
    }

    /**
     * Get article title text
     * @returns Article title text
     */
    async getArticleTitle(): Promise<string> {
        await this.elementToBeVisible(this.articleTitle);
        return this.articleTitle.innerText();
    }

    /**
     * Get article content text
     * @returns Full article content text
     */
    async getArticleContent(): Promise<string> {
        await this.elementToBeVisible(this.articleContent);
        return this.articleContent.innerText();
    }

    /**
     * Click Edit button on the article page
     */
    async clickEdit(): Promise<void> {
        await this.elementToBeVisible(this.editButton);
        await this.editButton.click();
    }
}

