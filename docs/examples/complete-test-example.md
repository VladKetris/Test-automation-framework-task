# Complete Test Example

This example demonstrates a full test implementation using:
1.  **Page Objects** (Atomic actions)
2.  **Steps Classes** (Business logic with composite methods)
3.  **Fixtures** (Dependency injection)
4.  **Playwright Test** (Execution)

## 1. Page Object (`tests/pages/WikipediaCreateAccountPage.ts`)

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class WikipediaCreateAccountPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page, page.locator("input#wpName2"), "WikipediaCreateAccountPage");
        this.usernameInput = page.locator("input#wpName2").describe("Username input");
        this.passwordInput = page.locator("input#wpPassword2").describe("Password input");
        this.confirmPasswordInput = page.locator("input#wpRetype").describe("Confirm password input");
        this.createAccountButton = page.locator("button#wpCreateaccount").describe("Create account button");
    }

    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameInput);
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.passwordInput);
        await this.passwordInput.fill(password);
    }

    async enterConfirmPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.confirmPasswordInput);
        await this.confirmPasswordInput.fill(password);
    }

    async clickCreateAccount(): Promise<void> {
        await this.elementToBeVisible(this.createAccountButton);
        await this.createAccountButton.click();
    }
}
```

## 2. Steps Class (`tests/steps/WikipediaCreateAccountSteps.ts`)

```typescript
import { Page } from "@playwright/test";
import { WikipediaCreateAccountPage } from "@pages/WikipediaCreateAccountPage";
import { WikipediaGetStartedPopupPage } from "@pages/WikipediaGetStartedPopupPage";
import { step } from "@utils/decorators";

export class WikipediaCreateAccountSteps {
    readonly wikipediaCreateAccountPage: WikipediaCreateAccountPage;
    readonly wikipediaGetStartedPopupPage: WikipediaGetStartedPopupPage;

    // ✅ Dependency Injection via Constructor
    constructor(
        private wikipediaCreateAccountPage: WikipediaCreateAccountPage,
        private wikipediaGetStartedPopupPage: WikipediaGetStartedPopupPage
    ) {}

    @step('Verify Create Account page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.wikipediaCreateAccountPage.verifyPageOpened();
    }

    // ✅ Composite method: combines related actions
    @step('Fill account creation form with username "{0}"')
    async fillAccountForm(username: string, password: string): Promise<void> {
        await this.wikipediaCreateAccountPage.enterUsername(username);
        await this.wikipediaCreateAccountPage.enterPassword(password);
        await this.wikipediaCreateAccountPage.enterConfirmPassword(password);
    }

    @step('Click "Create your account"')
    async clickCreateAccount(): Promise<void> {
        await this.wikipediaCreateAccountPage.clickCreateAccount();
    }

    // ✅ Composite method: verify + dismiss + verify closed
    @step('Verify and dismiss "Get started here" popup with text "{0}"')
    async verifyAndDismissGetStartedPopup(expectedText: string): Promise<void> {
        await this.wikipediaGetStartedPopupPage.verifyPopupVisible();
        await this.wikipediaGetStartedPopupPage.verifyPopupContainsText(expectedText);
        await this.wikipediaGetStartedPopupPage.clickGotIt();
        await this.wikipediaGetStartedPopupPage.verifyPopupHidden();
    }
}
```

## 3. Fixtures (`tests/fixtures/steps.fixture.ts`)

The framework separates Page Object creation from Steps creation.

```typescript
import { test as apiTest } from "@fixtures/api.fixture";
import { WikipediaCreateAccountSteps } from "@steps/WikipediaCreateAccountSteps";

type StepsFixtures = {
    wikipediaCreateAccountSteps: WikipediaCreateAccountSteps;
};

// Extend apiTest (which extends pagesTest)
export const test = apiTest.extend<StepsFixtures>({
    // Inject existing Page Objects into Step Classes
    wikipediaCreateAccountSteps: async ({ wikipediaCreateAccountPage, wikipediaGetStartedPopupPage }, use) => {
        await use(new WikipediaCreateAccountSteps(wikipediaCreateAccountPage, wikipediaGetStartedPopupPage));
    },
});
```

## 4. Test Spec (`tests/specs/wikipedia-create-account.spec.ts`)

Tests can use **both** Page Objects and Steps:
- **Steps** for business-meaningful actions (login, fill form, composite workflows)
- **Page Objects** for simple, single atomic actions (click, verify element)

```typescript
import { randomUsername, randomPassword } from '@utils/test-data-generator';
import { test } from '@fixtures';

test.describe('Wikipedia Account Creation', () => {
    // Test constants - no magic values!
    const MIN_PASSWORD_LENGTH = 12;
    const GET_STARTED_POPUP_MESSAGE = 'Click on your username to visit your homepage.';

    // ✅ Precondition shared by all tests in this file
    test.beforeEach(async ({ wikipediaLandingSteps }) => {
        // Steps: business action (open + verify)
        await wikipediaLandingSteps.openAndVerify();
        await wikipediaLandingSteps.selectEnglishAndVerifyMainPage();
    });

    test('Successful account creation on Wikipedia', async ({
        wikipediaNavigationMenu,          // PO for atomic actions
        wikipediaCreateAccountPage,       // PO for atomic actions
        wikipediaCreateAccountSteps,      // Steps for business logic
        wikipediaMainPage                 // PO for atomic verification
    }) => {
        // Generate random credentials
        const username = randomUsername();
        const password = randomPassword(MIN_PASSWORD_LENGTH);

        // PO: single atomic click
        await wikipediaNavigationMenu.clickCreateAccount();

        // PO: single atomic verification
        await wikipediaCreateAccountPage.verifyPageOpened();

        // Steps: composite business action (fills 3 fields)
        await wikipediaCreateAccountSteps.fillAccountForm(username, password);

        // PO: single atomic click
        await wikipediaCreateAccountPage.clickCreateAccount();

        // PO: single atomic verification
        await wikipediaMainPage.verifyPageOpened();

        // Steps: composite business action (verify + dismiss + verify closed)
        await wikipediaCreateAccountSteps.verifyAndDismissGetStartedPopup(GET_STARTED_POPUP_MESSAGE);
    });
});
```

## Key Patterns Demonstrated

1. **Test constants** - No magic values, use named constants
2. **Composite methods** - Use Steps for multi-action workflows (`fillAccountForm`, `verifyAndDismissGetStartedPopup`)
3. **Atomic actions** - Use Page Objects directly for single click/verify operations
4. **`@step` decorator** - All Steps methods are decorated for reporting
5. **Random data** - Use `testDataGenerator` for unique test data
6. **Mixed PO + Steps** - Choose based on business meaning, not line count
