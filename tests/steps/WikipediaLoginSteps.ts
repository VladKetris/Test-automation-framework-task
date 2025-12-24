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

    @step('Enter Username and Password on the Login Page')
    async enterCredentials(credentials: { username: string; password: string }): Promise<void> {
        await this.loginPage.enterUsername(credentials.username);
        await this.loginPage.enterPassword(credentials.password);
    }

    @step('Click "Log in" on the Login Page')
    async clickLoginButton(): Promise<void> {
        await this.loginPage.clickLogin();
    }

    @step('Login to Wikipedia')
    async login(credentials: { username: string; password: string }): Promise<void> {
        await this.enterCredentials(credentials);
        await this.clickLoginButton();
    }
}
