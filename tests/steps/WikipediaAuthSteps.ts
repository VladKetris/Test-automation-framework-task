import { WikipediaMainSteps } from './WikipediaMainSteps';
import { WikipediaNavigationMenu } from '@pages/WikipediaNavigationMenu';
import { WikipediaLoginSteps } from './WikipediaLoginSteps';
import { WikipediaMainPage } from '@pages/WikipediaMainPage';
import { step } from '@utils/decorators';

export class WikipediaAuthSteps {
    constructor(
        private readonly mainSteps: WikipediaMainSteps,
        private readonly navigationMenu: WikipediaNavigationMenu,
        private readonly loginSteps: WikipediaLoginSteps,
        private readonly mainPage: WikipediaMainPage
    ) {}

    @step('Authenticate user via UI login flow')
    async authenticateUser(credentials: { username: string; password: string }): Promise<void> {
        await this.mainSteps.openDirectlyAndVerify();
        await this.navigationMenu.clickLogIn();
        await this.loginSteps.verifyPageOpened();
        await this.loginSteps.login(credentials);
        await this.mainPage.verifyPageOpened();
    }
}

