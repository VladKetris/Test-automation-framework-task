import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { extractNumberFromString, normalizeString } from '@utils/string-utils';

export class DemoblazeCartPage extends BasePage {
    private readonly cartRows: Locator;
    private readonly rowByProductName: (productName: string) => Locator;
    private readonly productNameCell: (productName: string) => Locator;
    private readonly productPriceCell: (productName: string) => Locator;
    private readonly totalPrice: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator('#totalp').describe('Cart total price'),
            'DemoblazeCartPage'
        );
        this.cartRows = page.locator('#tbodyid tr').describe('Cart rows');
        this.rowByProductName = (productName: string) => page.locator('#tbodyid tr', {
            has: page.locator('td', { hasText: productName }),
        }).describe('Cart row by product name');
        this.productNameCell = (productName: string) => this.rowByProductName(productName).locator('td').nth(1).describe('Cart product name');
        this.productPriceCell = (productName: string) => this.rowByProductName(productName).locator('td').nth(2).describe('Cart product price');
        this.totalPrice = page.locator('#totalp').describe('Cart total price');
    }

    async verifyProductPresent(productName: string): Promise<void> {
        await this.elementToBeVisible(this.cartRows.first());
        await this.elementToBeVisible(this.rowByProductName(productName));
    }

    async getProductName(productName: string): Promise<string> {
        return normalizeString(await this.productNameCell(productName).innerText());
    }

    async getProductPrice(productName: string): Promise<number> {
        return extractNumberFromString(await this.productPriceCell(productName).innerText());
    }

    async getTotalPrice(): Promise<number> {
        return extractNumberFromString(await this.totalPrice.innerText());
    }
}
