import { Page } from '@playwright/test';
import { DemoblazeHomePage } from '@pages/DemoblazeHomePage';
import { DemoblazeLoginModalPage } from '@pages/DemoblazeLoginModalPage';
import { DemoblazeSignUpModalPage } from '@pages/DemoblazeSignUpModalPage';
import { DemoblazeUser } from '@sharedTypes/demoblazeTypes';

abstract class AuthenticationFlowTemplate {
    private pendingDialog: Promise<import('@playwright/test').Dialog> | null = null;

    constructor(
        protected readonly page: Page,
        protected readonly homePage: DemoblazeHomePage
    ) { }

    async execute(user: DemoblazeUser): Promise<void> {
        await this.openEntryPoint();
        await this.fillCredentials(user);
        await this.beforeSubmit(user);
        await this.submit();
        await this.afterSubmit(user);
    }

    protected abstract openEntryPoint(): Promise<void>;
    protected abstract fillCredentials(user: DemoblazeUser): Promise<void>;
    protected abstract submit(): Promise<void>;

    protected async beforeSubmit(_user: DemoblazeUser): Promise<void> { }
    protected async afterSubmit(_user: DemoblazeUser): Promise<void> { }

    protected waitForDialog(): void {
        this.pendingDialog = this.page.waitForEvent('dialog');
    }

    protected async acceptPendingDialog(): Promise<void> {
        if (!this.pendingDialog) {
            return;
        }

        const dialog = await this.pendingDialog;
        await dialog.accept();
        this.pendingDialog = null;
    }
}

export class SignUpFlowTemplate extends AuthenticationFlowTemplate {
    constructor(
        page: Page,
        homePage: DemoblazeHomePage,
        private readonly signUpModalPage: DemoblazeSignUpModalPage
    ) {
        super(page, homePage);
    }

    protected async openEntryPoint(): Promise<void> {
        await this.homePage.openSignUpModal();
        await this.signUpModalPage.verifyPageOpened();
    }

    protected async fillCredentials(user: DemoblazeUser): Promise<void> {
        await this.signUpModalPage.enterUsername(user.username);
        await this.signUpModalPage.enterPassword(user.password);
    }

    protected async beforeSubmit(): Promise<void> {
        this.waitForDialog();
    }

    protected async submit(): Promise<void> {
        await this.signUpModalPage.submit();
    }

    protected async afterSubmit(): Promise<void> {
        await this.acceptPendingDialog();
    }
}

export class LoginFlowTemplate extends AuthenticationFlowTemplate {
    constructor(
        page: Page,
        homePage: DemoblazeHomePage,
        private readonly loginModalPage: DemoblazeLoginModalPage
    ) {
        super(page, homePage);
    }

    protected async openEntryPoint(): Promise<void> {
        await this.homePage.openLoginModal();
        await this.loginModalPage.verifyPageOpened();
    }

    protected async fillCredentials(user: DemoblazeUser): Promise<void> {
        await this.loginModalPage.enterUsername(user.username);
        await this.loginModalPage.enterPassword(user.password);
    }

    protected async submit(): Promise<void> {
        await this.loginModalPage.submit();
    }

    protected async afterSubmit(user: DemoblazeUser): Promise<void> {
        await this.homePage.verifyUsernameDisplayed(user.username);
    }
}
