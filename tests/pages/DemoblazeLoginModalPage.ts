import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class DemoblazeLoginModalPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('#logInModal.show').describe('Visible log in modal'),
            'DemoblazeLoginModalPage'
        );
        this.usernameInput = page.locator('#loginusername').describe('Log in username input');
        this.passwordInput = page.locator('#loginpassword').describe('Log in password input');
        this.loginButton = page.locator('#logInModal .btn.btn-primary').describe('Log in submit button');
    }

    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async submit(): Promise<void> {
        await this.loginButton.click();
    }
}
