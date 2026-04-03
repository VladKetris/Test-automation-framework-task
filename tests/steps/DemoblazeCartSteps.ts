import { expect } from '@playwright/test';
import { DemoblazeCartPage } from '@pages/DemoblazeCartPage';
import { DemoblazeProductExpectation } from '@sharedTypes/demoblazeTypes';
import { step } from '@utils/decorators';

export class DemoblazeCartSteps {
    constructor(
        private readonly cartPage: DemoblazeCartPage
    ) { }

    @step('Verify Demoblaze cart contains the selected product')
    async verifyProductInCart(expected: Pick<DemoblazeProductExpectation, 'name' | 'price'>): Promise<void> {
        await this.cartPage.verifyPageOpened();
        await this.cartPage.verifyProductPresent(expected.name);
        expect(await this.cartPage.getProductName(expected.name)).toBe(expected.name);
        expect(await this.cartPage.getProductPrice(expected.name)).toBe(expected.price);
        expect(await this.cartPage.getTotalPrice()).toBe(expected.price);
    }
}
