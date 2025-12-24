import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';

test.describe('Wikipedia Navigation Menu for Authenticated User', () => {

    test('Navigation menu shows user context', async ({
        wikipediaNavigationMenu, wikipediaAuthSteps
    }) => {
        const { username, password } = getWikipediaCredentials();
        await wikipediaAuthSteps.authenticateUser(username, password);

        await wikipediaNavigationMenu.verifyUsernameDisplayed(username);
        await wikipediaNavigationMenu.verifyAlertDisplayed();
        await wikipediaNavigationMenu.openPersonalToolsDropdown();
        await wikipediaNavigationMenu.verifyLogOutLinkDisplayed();
    });

});

