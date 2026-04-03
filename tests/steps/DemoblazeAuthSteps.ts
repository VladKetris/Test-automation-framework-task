import { Page } from '@playwright/test';
import { DemoblazeHomePage } from '@pages/DemoblazeHomePage';
import { DemoblazeLoginModalPage } from '@pages/DemoblazeLoginModalPage';
import { DemoblazeSignUpModalPage } from '@pages/DemoblazeSignUpModalPage';
import { DemoblazeUser } from '@sharedTypes/demoblazeTypes';
import { step } from '@utils/decorators';
import { LoginFlowTemplate, SignUpFlowTemplate } from '@utils/patterns/auth-flow-template';

export class DemoblazeAuthSteps {
    constructor(
        private readonly page: Page,
        private readonly homePage: DemoblazeHomePage,
        private readonly signUpModalPage: DemoblazeSignUpModalPage,
        private readonly loginModalPage: DemoblazeLoginModalPage
    ) { }

    @step('Sign up a new Demoblaze user')
    async signUp(user: DemoblazeUser): Promise<void> {
        const signUpFlow = new SignUpFlowTemplate(this.page, this.homePage, this.signUpModalPage);
        await signUpFlow.execute(user);
    }

    @step('Log in with the created Demoblaze user')
    async login(user: DemoblazeUser): Promise<void> {
        const loginFlow = new LoginFlowTemplate(this.page, this.homePage, this.loginModalPage);
        await loginFlow.execute(user);
    }

    @step('Verify username is displayed in the Demoblaze navigation bar')
    async verifyLoggedInUser(user: DemoblazeUser): Promise<void> {
        await this.homePage.verifyUsernameDisplayed(user.username);
    }
}
