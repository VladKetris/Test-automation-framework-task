import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestNavigationMenuPage extends BasePage {
    private readonly logInLink: Locator;
    private readonly productsLink: Locator;
    private readonly logOutLink: Locator;

    constructor(page: Page) {
        super(page, page.locator('//div[@class="shop-menu pull-right"]'), 'TestNavigationMenuPage');
        this.logInLink = page.getByRole('link', { name: /signup \/ login/i }).describe('Log in link');
        this.productsLink = page.getByRole('link', { name: /products/i }).describe('Products link');
        this.logOutLink = page.getByRole('link', { name: /logout/i }).describe('Logout link');
    }

    async clickProducts(): Promise<void> {
        await this.elementToBeVisible(this.productsLink);
        await this.productsLink.click();
    }

    async clickLogIn(): Promise<void> {
        await this.elementToBeVisible(this.logInLink);
        await this.logInLink.click();
    }

    async verifyUserLoggedIn(): Promise<void> {
        await this.elementToBeVisible(this.logOutLink);
    }
}

