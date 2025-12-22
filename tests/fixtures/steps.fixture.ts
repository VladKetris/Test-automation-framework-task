import { test as apiTest } from './api.fixture';

// Steps imports
import {
    WikipediaMainSteps,
    WikipediaLoginSteps,
    WikipediaSearchSteps,
    WikipediaArticleEditSteps,
    WikipediaArticleCreateSteps
} from '@steps';
import { WikipediaAuthSteps } from '@steps/WikipediaAuthSteps';

/**
 * Steps fixtures - creates Steps with injected Page Objects
 */
type StepsFixtures = {
    wikipediaMainSteps: WikipediaMainSteps;
    wikipediaLoginSteps: WikipediaLoginSteps;
    wikipediaSearchSteps: WikipediaSearchSteps;
    wikipediaArticleEditSteps: WikipediaArticleEditSteps;
    wikipediaArticleCreateSteps: WikipediaArticleCreateSteps;
    wikipediaAuthSteps: WikipediaAuthSteps;
};

/**
 * Extended test fixture with Steps that receive injected Page Objects.
 * 
 * @example
 * import { test, expect } from '@fixtures/steps.fixture';
 * 
 * test('login flow', async ({ wikipediaLoginSteps, wikipediaNavigationMenu }) => {
 *     await wikipediaNavigationMenu.clickLogIn();  // PO for atomic action
 *     await wikipediaLoginSteps.login('user', 'pass');  // Steps for business logic
 * });
 */
export const test = apiTest.extend<StepsFixtures>({
    // Steps receive Page Objects via dependency injection
    wikipediaMainSteps: async ({ wikipediaMainPage }, use) => {
        await use(new WikipediaMainSteps(wikipediaMainPage));
    },

    wikipediaLoginSteps: async ({ wikipediaLoginPage }, use) => {
        await use(new WikipediaLoginSteps(wikipediaLoginPage));
    },

    wikipediaSearchSteps: async ({ wikipediaNavigationMenu, wikipediaArticlePage }, use) => {
        await use(new WikipediaSearchSteps(wikipediaNavigationMenu, wikipediaArticlePage));
    },

    wikipediaArticleEditSteps: async ({ wikipediaVisualEditorPage, wikipediaSaveChangesDialogPage }, use) => {
        await use(new WikipediaArticleEditSteps(wikipediaVisualEditorPage, wikipediaSaveChangesDialogPage));
    },

    wikipediaArticleCreateSteps: async ({ wikipediaCreatePagePage, wikipediaNavigationMenu }, use) => {
        await use(new WikipediaArticleCreateSteps(wikipediaCreatePagePage, wikipediaNavigationMenu));
    },

    wikipediaAuthSteps: async ({ wikipediaMainSteps, wikipediaNavigationMenu, wikipediaLoginSteps, wikipediaMainPage }, use) => {
        await use(new WikipediaAuthSteps(wikipediaMainSteps, wikipediaNavigationMenu, wikipediaLoginSteps, wikipediaMainPage));
    },
});

// Re-export pages fixtures types
export type { AllPagesFixtures } from './pages.fixture';
