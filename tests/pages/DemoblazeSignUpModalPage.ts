import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class DemoblazeSignUpModalPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signUpButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('#signInModal.show').describe('Visible sign up modal'),
            'DemoblazeSignUpModalPage'
        );
        this.usernameInput = page.locator('#sign-username').describe('Sign up username input');
        this.passwordInput = page.locator('#sign-password').describe('Sign up password input');
        this.signUpButton = page.locator('#signInModal .btn.btn-primary').describe('Sign up submit button');
    }

    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async submit(): Promise<void> {
        await this.signUpButton.click();
    }
}
