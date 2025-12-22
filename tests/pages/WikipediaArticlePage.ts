import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaArticlePage extends BasePage {
    private readonly articleTitle: Locator;
    private readonly articleContent: Locator;
    private readonly firstParagraph: Locator;

    constructor(page: Page) {
        super(
            page,
            page.getByRole('link', { name: 'Edit' }),
            'WikipediaArticlePage'
        );
        this.articleTitle = page.locator('#firstHeading').describe('Article title heading');
        this.articleContent = page.locator('#mw-content-text').describe('Article content container');
        this.firstParagraph = page.locator('#mw-content-text .mw-parser-output > p').first().describe('First paragraph of article');
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
     * Verify first paragraph contains expected text
     * @param expectedText Expected text in first paragraph
     */
    async verifyFirstParagraphContainsText(expectedText: string): Promise<void> {
        await this.elementToBeVisible(this.firstParagraph);
        await this.elementToContainText(this.firstParagraph, expectedText);
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
}

