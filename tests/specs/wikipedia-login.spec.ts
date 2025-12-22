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

        const { username, password } = getWikipediaCredentials();
        await wikipediaLoginSteps.login(username, password);

        await wikipediaMainPage.verifyPageOpened();
    });

});
