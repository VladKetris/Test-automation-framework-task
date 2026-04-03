import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { getDemoblazeEnvironment } from '@utils/config';

export class DemoblazeHomePage extends BasePage {
    private readonly signUpLink: Locator;
    private readonly logInLink: Locator;
    private readonly cartLink: Locator;
    private readonly welcomeUserLabel: Locator;
    private readonly categoryLink: (categoryName: string) => Locator;
    private readonly productLink: (productName: string) => Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('#carouselExampleIndicators').describe('Home page carousel'),
            'DemoblazeHomePage'
        );
        this.signUpLink = page.getByRole('link', { name: 'Sign up' }).describe('Sign up link');
        this.logInLink = page.getByRole('link', { name: 'Log in' }).describe('Log in link');
        this.cartLink = page.locator('#cartur').describe('Cart link');
        this.welcomeUserLabel = page.locator('#nameofuser').describe('Logged in username label');
        this.categoryLink = (categoryName: string) => page.locator('#itemc', { hasText: categoryName }).describe('Category link');
        this.productLink = (productName: string) => page.getByRole('link', { name: productName }).describe('Product link');
    }

    async navigate(): Promise<void> {
        await this.page.goto(getDemoblazeEnvironment().homeUrl);
    }

    async openSignUpModal(): Promise<void> {
        await this.elementToBeVisible(this.signUpLink);
        await this.signUpLink.click();
    }

    async openLoginModal(): Promise<void> {
        await this.elementToBeVisible(this.logInLink);
        await this.logInLink.click();
    }

    async openCart(): Promise<void> {
        await this.elementToBeVisible(this.cartLink);
        await this.cartLink.click();
    }

    async selectCategory(categoryName: string): Promise<void> {
        await this.elementToBeVisible(this.categoryLink(categoryName));
        await this.categoryLink(categoryName).click();
    }

    async openProductDetails(productName: string): Promise<void> {
        await this.elementToBeVisible(this.productLink(productName));
        await this.productLink(productName).click();
    }

    async verifyUsernameDisplayed(expectedUsername: string): Promise<void> {
        await this.elementToContainText(this.welcomeUserLabel, expectedUsername);
    }
}
