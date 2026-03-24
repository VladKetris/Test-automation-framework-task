import { expect } from '@playwright/test';
import { step } from '@utils/decorators';
import { TestViewCartPage } from '@pages/TestViewCartPage';
import { TestProductCartDetails } from '@sharedTypes/testTypes';

export class TestViewCartSteps {
    constructor(
        private readonly viewCartPage: TestViewCartPage
    ) { }

    @step('Verify cart page is opened and contains expected products')
    async verifyProductsInCart(products: TestProductCartDetails[]): Promise<void> {
        await this.viewCartPage.verifyPageOpened();
        await this.viewCartPage.verifyCartContainsProducts(products);

        for (const product of products) {
            expect(await this.viewCartPage.getProductName(product.name)).toBe(product.name);
            expect(await this.viewCartPage.getProductPrice(product.name)).toBe(product.price);
            expect(await this.viewCartPage.getProductQuantity(product.name)).toBe(product.quantity);
            expect(await this.viewCartPage.getProductTotalPrice(product.name)).toBe(product.total);
        }
    }
}
