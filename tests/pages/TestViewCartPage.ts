import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { extractNumberFromString, normalizeString } from '@utils/string-utils';
import { TestProductCartDetails } from '@sharedTypes/testTypes';

export class TestViewCartPage extends BasePage {
    private readonly cartRows: Locator;
    private readonly cartRowByProductName: (productName: string) => Locator;
    private readonly cartProductName: (productName: string) => Locator;
    private readonly cartProductPrice: (productName: string) => Locator;
    private readonly cartProductQuantity: (productName: string) => Locator;
    private readonly cartProductTotalPrice: (productName: string) => Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('.breadcrumbs .active').describe('Shopping cart breadcrumb'),
            'TestViewCartPage'
        );
        this.cartRows = page.locator('#cart_info_table tbody tr').describe('Cart product rows');
        this.cartRowByProductName = (productName: string) => page.locator('#cart_info_table tbody tr', {
            has: page.locator('.cart_description h4 a', { hasText: productName }),
        }).describe('Cart row by product name');
        this.cartProductName = (productName: string) => this.cartRowByProductName(productName).locator('.cart_description h4 a').describe('Cart product name');
        this.cartProductPrice = (productName: string) => this.cartRowByProductName(productName).locator('.cart_price p').describe('Cart product price');
        this.cartProductQuantity = (productName: string) => this.cartRowByProductName(productName).locator('.cart_quantity button').describe('Cart product quantity');
        this.cartProductTotalPrice = (productName: string) => this.cartRowByProductName(productName).locator('.cart_total p').describe('Cart product total price');
    }

    async verifyCartContainsProducts(products: TestProductCartDetails[]): Promise<void> {
        await this.elementToBeVisible(this.cartRows.first());
        for (const product of products) {
            await this.elementToBeVisible(this.cartRowByProductName(product.name));
        }
    }

    async getProductName(productName: string): Promise<string> {
        return normalizeString(await this.cartProductName(productName).innerText());
    }

    async getProductPrice(productName: string): Promise<number> {
        return extractNumberFromString(await this.cartProductPrice(productName).innerText());
    }

    async getProductQuantity(productName: string): Promise<number> {
        return Number(await this.cartProductQuantity(productName).innerText());
    }

    async getProductTotalPrice(productName: string): Promise<number> {
        return extractNumberFromString(await this.cartProductTotalPrice(productName).innerText());
    }
}
