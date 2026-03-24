import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

const LOGIN_PAGE_TITLE = /login to your account/i;

export class TestLoginPage extends BasePage {
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page, page.getByRole('heading', { name: LOGIN_PAGE_TITLE }), 'TestLoginPage');
        this.emailInput = page.locator('[data-qa="login-email"]').describe('Login email input');
        this.passwordInput = page.locator('[data-qa="login-password"]').describe('Login password input');
        this.loginButton = page.locator('[data-qa="login-button"]').describe('Login button');
    }

    async enterEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }
}
