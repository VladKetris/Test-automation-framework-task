import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';

test.describe('Wikipedia Navigation Menu for Authenticated User', () => {

    test('Navigation menu shows user context', async ({
        wikipediaNavigationMenu, wikipediaAuthSteps
    }) => {
        const credentials = getWikipediaCredentials();
        await wikipediaAuthSteps.authenticateUser(credentials);

        await wikipediaNavigationMenu.verifyUsernameDisplayed(credentials.username);
        await wikipediaNavigationMenu.verifyAlertDisplayed();
        await wikipediaNavigationMenu.openPersonalToolsDropdown();
        await wikipediaNavigationMenu.verifyLogOutLinkDisplayed();
    });

});

