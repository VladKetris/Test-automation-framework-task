import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { extractNumberFromString, normalizeString } from '@utils/string-utils';
import { TestProductDetails } from '@sharedTypes/testTypes';

const PRODUCTS_PAGE_TITLE = /all products/i;

export class TestProductsPage extends BasePage {
    private readonly productsContainer: Locator;
    private readonly productCards: (index: number) => Locator;
    private readonly productInfoBlocks: (index: number) => Locator;
    private readonly addToCartButtons: (index: number) => Locator;
    private readonly productNames: (index: number) => Locator;
    private readonly productPrices: (index: number) => Locator;

    constructor(page: Page) {
        super(
            page,
            page.getByRole('heading', { name: PRODUCTS_PAGE_TITLE }),
            'TestProductsPage'
        );
        this.productsContainer = page.locator('.features_items').describe('All products container');
        this.productCards = (index: number) => page.locator('.features_items .single-products').nth(index).describe('Product card');
        this.productInfoBlocks = (index: number) => this.productCards(index).locator('.productinfo').describe('Product info block');
        this.addToCartButtons = (index: number) => this.productInfoBlocks(index).locator('a.add-to-cart').describe('Add to cart button');
        this.productNames = (index: number) => this.productInfoBlocks(index).locator('p').describe('Product name');
        this.productPrices = (index: number) => this.productInfoBlocks(index).locator('h2').describe('Product price');
    }

    async getProductCount(): Promise<number> {
        return this.page.locator('.features_items .single-products').count();
    }

    async verifyProductListVisible(): Promise<void> {
        await this.elementToBeVisible(this.productsContainer);
    }

    async hoverOverProductByIndex(index: number): Promise<void> {
      await this.elementToBeVisible(this.productCards(index));
      await this.productCards(index).hover();
    }

    async addProductToCartByIndex(index: number): Promise<void> {
        await this.elementToBeVisible(this.productCards(index));
        await this.elementToBeVisible(this.addToCartButtons(index));
        await this.addToCartButtons(index).click();
    }

    async getProductDetailsByIndex(index: number): Promise<TestProductDetails> {
        const name = normalizeString(await this.productNames(index).innerText());
        const price = extractNumberFromString(await this.productPrices(index).innerText());

        return {
            name,
            price,
        };
    }
}
