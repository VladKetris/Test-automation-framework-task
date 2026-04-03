import { Page } from '@playwright/test';
import { DemoblazeHomePage } from '@pages/DemoblazeHomePage';
import { DemoblazeProductPage } from '@pages/DemoblazeProductPage';
import { DemoblazeProductExpectation } from '@sharedTypes/demoblazeTypes';
import { step } from '@utils/decorators';
import {
    AddToCartCommand,
    OpenCartCommand,
    OpenProductCommand,
    SelectCategoryCommand,
} from '@utils/patterns/demoblaze-commands';
import { ProductVerificationStrategyFactory } from '@utils/patterns/product-verification-strategies';
import { CommandBus } from '@utils/patterns/ui-commands';

export class DemoblazeCatalogSteps {
    private readonly commandBus = new CommandBus();
    private readonly strategyFactory = new ProductVerificationStrategyFactory();

    constructor(
        private readonly page: Page,
        private readonly homePage: DemoblazeHomePage,
        private readonly productPage: DemoblazeProductPage
    ) { }

    @step('Open category "{0}" and product "{1}"')
    async openCategoryProduct(categoryName: string, productName: string): Promise<void> {
        await this.commandBus.executeAll([
            new SelectCategoryCommand(this.page, this.homePage, categoryName),
            new OpenProductCommand(this.page, this.homePage, productName),
        ]);
        await this.productPage.verifyPageOpened();
    }

    @step('Verify product details with dynamic validation strategies')
    async verifyProductDetails(categoryName: string, expected: DemoblazeProductExpectation): Promise<void> {
        const actual = await this.productPage.getProductDetails(categoryName);

        for (const fieldName of Object.keys(expected)) {
            const typedFieldName = fieldName as keyof DemoblazeProductExpectation;
            const strategy = this.strategyFactory.getStrategy(typedFieldName);

            await strategy.verify({
                actual,
                expected,
            }, typedFieldName);
        }
    }

    @step('Add current Demoblaze product to cart')
    async addCurrentProductToCart(): Promise<void> {
        await this.commandBus.execute(new AddToCartCommand(this.productPage));
    }

    @step('Open Demoblaze cart page')
    async openCart(): Promise<void> {
        await this.commandBus.execute(new OpenCartCommand(this.page, this.homePage));
    }
}
