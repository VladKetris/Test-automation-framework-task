import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { DemoblazeProductDetails } from '@sharedTypes/demoblazeTypes';
import { extractNumberFromString, normalizeString } from '@utils/string-utils';

export class DemoblazeProductPage extends BasePage {
    private readonly productName: Locator;
    private readonly productPrice: Locator;
    private readonly productDescription: Locator;
    private readonly addToCartLink: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('.name').describe('Product details name'),
            'DemoblazeProductPage'
        );
        this.productName = page.locator('.name').describe('Product details name');
        this.productPrice = page.locator('.price-container').describe('Product details price');
        this.productDescription = page.locator('#more-information').describe('Product details description');
        this.addToCartLink = page.getByRole('link', { name: 'Add to cart' }).describe('Add to cart link');
    }

    async getProductDetails(category: string): Promise<DemoblazeProductDetails> {
        return {
            name: normalizeString(await this.productName.innerText()),
            price: extractNumberFromString(await this.productPrice.innerText()),
            description: normalizeString(await this.productDescription.innerText()),
            category,
        };
    }

    async addToCart(): Promise<void> {
        const addToCartDialog = this.page.waitForEvent('dialog');
        await this.addToCartLink.click();
        const dialog = await addToCartDialog;
        await dialog.accept();
    }
}
