import { WikipediaLoginPage } from '@pages/WikipediaLoginPage';
import { step } from '@utils/decorators';

export class WikipediaLoginSteps {
    constructor(
        readonly loginPage: WikipediaLoginPage
    ) { }

    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
        await this.loginPage.verifyLoginPageTitle();
    }

    @step('Enter Username "{0}" and Password on the Login Page')
    async enterCredentials(username: string, password: string): Promise<void> {
        await this.loginPage.enterUsername(username);
        await this.loginPage.enterPassword(password);
    }

    @step('Click "Log in" on the Login Page')
    async clickLoginButton(): Promise<void> {
        await this.loginPage.clickLogin();
    }

    @step('Login to Wikipedia with "{0}"')
    async login(username: string, password: string): Promise<void> {
        await this.enterCredentials(username, password);
        await this.clickLoginButton();
    }
}
