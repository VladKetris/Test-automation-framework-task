import { test as base, expect } from '@playwright/test';
import { matchers } from '@utils/matchers';

// Extend expect with custom matchers (done once at lowest fixture level)
expect.extend(matchers);

// Page Objects imports
import {
    WikipediaArticlePage,
    WikipediaMainPage,
    WikipediaLoginPage,
    WikipediaNavigationMenu,
    WikipediaDonatePage,
    WikipediaCreatePagePage,
    WikipediaVisualEditorPage,
    WikipediaSaveChangesDialogPage,
    WikipediaWatchlistConfirmationPopupPage,
    TestMainPage,
    TestNavigationMenuPage,
    TestLoginPage,
    TestProductsPage,
    TestAddedToCartPopupPage,
    TestViewCartPage,
    DemoblazeHomePage,
    DemoblazeSignUpModalPage,
    DemoblazeLoginModalPage,
    DemoblazeProductPage,
    DemoblazeCartPage,
    PageFactory,
} from '@pages';
import { withActionLogging } from '@utils/patterns/withActionLogging';

/**
 * Page Object fixtures - creates all PO instances
 */
type PagesFixtures = {
    wikipediaArticlePage: WikipediaArticlePage;
    wikipediaMainPage: WikipediaMainPage;
    wikipediaLoginPage: WikipediaLoginPage;
    wikipediaNavigationMenu: WikipediaNavigationMenu;
    wikipediaDonatePage: WikipediaDonatePage;
    wikipediaCreatePagePage: WikipediaCreatePagePage;
    wikipediaVisualEditorPage: WikipediaVisualEditorPage;
    wikipediaSaveChangesDialogPage: WikipediaSaveChangesDialogPage;
    wikipediaWatchlistConfirmationPopupPage: WikipediaWatchlistConfirmationPopupPage;
    testMainPage: TestMainPage;
    testNavigationMenuPage: TestNavigationMenuPage;
    testLoginPage: TestLoginPage;
    testProductsPage: TestProductsPage;
    testAddedToCardPopupPage: TestAddedToCartPopupPage;
    testViewCartPage: TestViewCartPage;
    demoblazeHomePage: DemoblazeHomePage;
    demoblazeSignUpModalPage: DemoblazeSignUpModalPage;
    demoblazeLoginModalPage: DemoblazeLoginModalPage;
    demoblazeProductPage: DemoblazeProductPage;
    demoblazeCartPage: DemoblazeCartPage;
};


export type AllPagesFixtures = PagesFixtures;

export const test = base.extend<AllPagesFixtures>({

    // ==================== Page Objects ====================
    wikipediaArticlePage: async ({ page }, use) => {
        await use(new WikipediaArticlePage(page));
    },

    wikipediaMainPage: async ({ page }, use) => {
        await use(new WikipediaMainPage(page));
    },

    wikipediaLoginPage: async ({ page }, use) => {
        await use(new WikipediaLoginPage(page));
    },

    wikipediaNavigationMenu: async ({ page }, use) => {
        await use(new WikipediaNavigationMenu(page));
    },

    wikipediaDonatePage: async ({ page }, use) => {
        await use(new WikipediaDonatePage(page));
    },

    wikipediaCreatePagePage: async ({ page }, use) => {
        await use(new WikipediaCreatePagePage(page));
    },

    wikipediaVisualEditorPage: async ({ page }, use) => {
        await use(new WikipediaVisualEditorPage(page));
    },

    wikipediaSaveChangesDialogPage: async ({ page }, use) => {
        await use(new WikipediaSaveChangesDialogPage(page));
    },

    wikipediaWatchlistConfirmationPopupPage: async ({ page }, use) => {
        await use(new WikipediaWatchlistConfirmationPopupPage(page));
    },

    testMainPage: async ({ page }, use) => {
        await use(new TestMainPage(page));
    },

    testNavigationMenuPage: async ({ page }, use) => {
        await use(new TestNavigationMenuPage(page));
    },

    testLoginPage: async ({ page }, use) => {
        await use(new TestLoginPage(page));
    },

    testProductsPage: async ({ page }, use) => {
        await use(new TestProductsPage(page));
    },

    testAddedToCardPopupPage: async ({ page }, use) => {
        await use(new TestAddedToCartPopupPage(page));
    },

    testViewCartPage: async ({ page }, use) => {
        await use(new TestViewCartPage(page));
    },

    demoblazeHomePage: async ({ page }, use) => {
        await use(withActionLogging(PageFactory.create<DemoblazeHomePage>(page, 'demoblaze-home'), 'DemoblazeHomePage'));
    },

    demoblazeSignUpModalPage: async ({ page }, use) => {
        await use(withActionLogging(PageFactory.create<DemoblazeSignUpModalPage>(page, 'demoblaze-signup-modal'), 'DemoblazeSignUpModalPage'));
    },

    demoblazeLoginModalPage: async ({ page }, use) => {
        await use(withActionLogging(PageFactory.create<DemoblazeLoginModalPage>(page, 'demoblaze-login-modal'), 'DemoblazeLoginModalPage'));
    },

    demoblazeProductPage: async ({ page }, use) => {
        await use(withActionLogging(PageFactory.create<DemoblazeProductPage>(page, 'demoblaze-product'), 'DemoblazeProductPage'));
    },

    demoblazeCartPage: async ({ page }, use) => {
        await use(withActionLogging(PageFactory.create<DemoblazeCartPage>(page, 'demoblaze-cart'), 'DemoblazeCartPage'));
    },
});
