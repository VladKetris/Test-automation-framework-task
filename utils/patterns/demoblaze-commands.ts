import { Page } from '@playwright/test';
import { DemoblazeHomePage } from '@pages/DemoblazeHomePage';
import { DemoblazeProductPage } from '@pages/DemoblazeProductPage';
import { UiCommand } from '@utils/patterns/ui-commands';

export class NavigateHomeCommand implements UiCommand {
    constructor(
        private readonly homePage: DemoblazeHomePage
    ) { }

    async execute(): Promise<void> {
        await this.homePage.navigate();
    }
}

export class SelectCategoryCommand implements UiCommand {
    constructor(
        private readonly page: Page,
        private readonly homePage: DemoblazeHomePage,
        private readonly categoryName: string
    ) { }

    async execute(): Promise<void> {
        await this.homePage.selectCategory(this.categoryName);
    }

    async undo(): Promise<void> {
        await this.page.goBack();
    }
}

export class OpenProductCommand implements UiCommand {
    constructor(
        private readonly page: Page,
        private readonly homePage: DemoblazeHomePage,
        private readonly productName: string
    ) { }

    async execute(): Promise<void> {
        await this.homePage.openProductDetails(this.productName);
    }

    async undo(): Promise<void> {
        await this.page.goBack();
    }
}

export class AddToCartCommand implements UiCommand {
    constructor(
        private readonly productPage: DemoblazeProductPage
    ) { }

    async execute(): Promise<void> {
        await this.productPage.addToCart();
    }
}

export class OpenCartCommand implements UiCommand {
    constructor(
        private readonly page: Page,
        private readonly homePage: DemoblazeHomePage
    ) { }

    async execute(): Promise<void> {
        await this.homePage.openCart();
    }

    async undo(): Promise<void> {
        await this.page.goBack();
    }
}
