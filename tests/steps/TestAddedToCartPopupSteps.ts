import { TestAddedToCartPopupPage } from '@pages/TestAddedToCartPopupPage';
import { step } from '@utils/decorators';

export class TestAddedToCartPopupSteps {
    constructor(
        private readonly addedToCartPopupPage: TestAddedToCartPopupPage
    ) { }

    @step('Continue shopping from added-to-cart popup')
    async continueShopping(): Promise<void> {
        await this.addedToCartPopupPage.verifyPopupVisible();
        await this.addedToCartPopupPage.clickContinueShopping();
        await this.addedToCartPopupPage.verifyPopupHidden();
    }

    @step('Open cart from added-to-cart popup')
    async openCart(): Promise<void> {
        await this.addedToCartPopupPage.verifyPopupVisible();
        await this.addedToCartPopupPage.clickViewCart();
    }
}
