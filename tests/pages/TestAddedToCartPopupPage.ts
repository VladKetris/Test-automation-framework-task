import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

const ADDED_TO_CART_POPUP_TITLE = /added!/i;

export class TestAddedToCartPopupPage extends BasePage {
    private readonly popupTitle: Locator;
    private readonly viewCartButton: Locator;
    private readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('#cartModal .modal-content', {
                has: page.getByRole('heading', { name: ADDED_TO_CART_POPUP_TITLE }),
            }).describe('Added to cart popup content'),
            'TestAddedToCartPopupPage'
        );
        this.popupTitle = this.formLocator.getByRole('heading', { name: ADDED_TO_CART_POPUP_TITLE }).describe('Popup title');
        this.viewCartButton = this.formLocator.getByRole('link', { name: /view cart/i }).describe('View cart link');
        this.continueShoppingButton = this.formLocator.getByRole('button', { name: /Continue Shopping/i }).describe('Continue shopping button');
    }

    async verifyPopupVisible(): Promise<void> {
        await this.elementToBeVisible(this.formLocator);
        await this.elementToBeVisible(this.popupTitle);
    }

    async clickViewCart(): Promise<void> {
        await this.viewCartButton.click();
    }

    async clickContinueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async verifyPopupHidden(): Promise<void> {
        await this.elementToBeHidden(this.formLocator);
        await this.elementToBeHidden(this.popupTitle);
    }
}
