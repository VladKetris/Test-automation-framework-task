import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

const LOGIN_PAGE_TITLE = /Log in/i;

export class WikipediaLoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page, page.locator('input#wpName1'), 'WikipediaLoginPage');
        this.usernameInput = page.locator('input#wpName1').describe('Username input');
        this.passwordInput = page.locator('input#wpPassword1').describe('Password input');
        this.loginButton = page.locator('button#wpLoginAttempt').describe('Login button');
    }

    /**
     * Enter username
     */
    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameInput);
        await this.usernameInput.fill(username);
    }

    /**
     * Enter password
     */
    async enterPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.passwordInput);
        await this.passwordInput.fill(password);
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.elementToBeVisible(this.loginButton);
        await this.loginButton.click();
    }

    /**
     * Verify login page title
     */
    async verifyLoginPageTitle(): Promise<void> {
        await this.verifyPageTitle(LOGIN_PAGE_TITLE);
    }
}
