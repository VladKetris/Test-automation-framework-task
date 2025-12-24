import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';

test.describe('Wikipedia Login Tests', () => {

    test('Verify successful login to Wikipedia', async ({
        wikipediaMainSteps,
        wikipediaNavigationMenu,
        wikipediaLoginSteps,
        wikipediaMainPage
    }) => {
        await wikipediaMainSteps.openDirectlyAndVerify();

        await wikipediaNavigationMenu.clickLogIn();

        await wikipediaLoginSteps.login(getWikipediaCredentials());

        await wikipediaMainPage.verifyPageOpened();
    });

});
