import { test as apiTest } from './api.fixture';

// Steps imports
import {
    WikipediaMainSteps,
    WikipediaLoginSteps
} from '@steps';

/**
 * Steps fixtures - creates Steps with injected Page Objects
 */
type StepsFixtures = {
    wikipediaMainSteps: WikipediaMainSteps;
    wikipediaLoginSteps: WikipediaLoginSteps;
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
});

// Re-export pages fixtures types
export type { AllPagesFixtures } from './pages.fixture';
