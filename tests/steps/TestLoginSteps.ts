import { TestLoginPage } from '@pages/TestLoginPage';
import { step } from '@utils/decorators';

export class TestLoginSteps {
    constructor(
        readonly loginPage: TestLoginPage
    ) { }

    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
    }

    @step('Enter Email and Password on the Login Page')
    async enterCredentials(credentials: { email: string; password: string }): Promise<void> {
        await this.loginPage.enterEmail(credentials.email);
        await this.loginPage.enterPassword(credentials.password);
    }

    @step('Click Log in on the Login Page')
    async clickLoginButton(): Promise<void> {
        await this.loginPage.clickLogin();
    }

    @step('Login with credentials')
    async login(credentials: { email: string; password: string }): Promise<void> {
        await this.verifyPageOpened();
        await this.enterCredentials(credentials);
        await this.clickLoginButton();
    }
}
