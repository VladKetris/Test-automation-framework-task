import { test as base } from '@playwright/test';

// Page Objects imports
import {
    WikipediaArticlePage,
    WikipediaMainPage,
    WikipediaLoginPage,
    WikipediaNavigationMenu,
    WikipediaDonatePage
} from '@pages';

/**
 * Page Object fixtures - creates all PO instances
 */
type PagesFixtures = {
    wikipediaArticlePage: WikipediaArticlePage;
    wikipediaMainPage: WikipediaMainPage;
    wikipediaLoginPage: WikipediaLoginPage;
    wikipediaNavigationMenu: WikipediaNavigationMenu;
    wikipediaDonatePage: WikipediaDonatePage;
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

});
