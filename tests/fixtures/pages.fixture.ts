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
    WikipediaSaveChangesDialogPage
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
    wikipediaCreatePagePage: WikipediaCreatePagePage;
    wikipediaVisualEditorPage: WikipediaVisualEditorPage;
    wikipediaSaveChangesDialogPage: WikipediaSaveChangesDialogPage;
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

});
