import { expect } from '@playwright/test';
import { TestProductsPage } from '@pages/TestProductsPage';
import { step } from '@utils/decorators';
import { TestProductCartDetails } from '@sharedTypes/testTypes';

export class TestProductsSteps {
    constructor(
        readonly productsPage: TestProductsPage
    ) { }

    @step('Verify Products page is opened and list is visible')
    async verifyPageOpened(): Promise<void> {
        await this.productsPage.verifyPageOpened();
        await this.productsPage.verifyProductListVisible();
        expect(await this.productsPage.getProductCount()).toBeGreaterThan(1);
    }

    @step('Add product to cart by index "{0}"')
    async addProductToCartByIndex(index: number): Promise<void> {
        await this.productsPage.hoverOverProductByIndex(index);
        await this.productsPage.addProductToCartByIndex(index);
    }

    @step('Build expected cart details from product index "{0}"')
    async getProductCartDetailsByIndex(index: number): Promise<TestProductCartDetails> {
        const product = await this.productsPage.getProductDetailsByIndex(index);

        return {
            ...product,
            quantity: 1,
            total: product.price,
        };
    }
}
