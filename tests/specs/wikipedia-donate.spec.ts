import { test } from '@fixtures';

test.describe('Wikipedia Donate Tests', () => {

    test('Verify Donate page is opened', async ({
        wikipediaMainSteps,
        wikipediaNavigationMenu,
        wikipediaDonatePage
    }) => {
        await wikipediaMainSteps.openDirectlyAndVerify();

        await wikipediaNavigationMenu.clickDonate();

        await wikipediaDonatePage.verifyPageOpened();

        await wikipediaDonatePage.verifyThankYouHeaderDisplayed();
    });
});
