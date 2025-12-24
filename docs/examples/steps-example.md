# Steps Class Example

Complete example of a Steps class following the [step-definition pattern](../patterns/step-definition.md).

**📘 Related:** [step-definition.md](../patterns/step-definition.md) | [complete-test-example.md](complete-test-example.md)

---

## TypeScript Implementation

### ✅ RECOMMENDED: Dependency Injection with Parameterized Methods

Steps classes receive Page Objects via constructor injection (from fixtures) and accept data as parameters.

```typescript
import { WikipediaLoginPage } from '@pages/WikipediaLoginPage';
import { WikipediaNavigationMenu } from '@pages/WikipediaNavigationMenu';
import { step } from '@utils/decorators';

export class WikipediaLoginSteps {
    constructor(
        private readonly loginPage: WikipediaLoginPage,
        private readonly navigationMenu: WikipediaNavigationMenu
    ) {}

    /**
     * Navigate to login page via navigation menu
     */
    @step('Navigate to Login page')
    async navigateToLogin(): Promise<void> {
        await this.navigationMenu.clickLogIn();
    }

    /**
     * Verify login page is displayed
     */
    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
        await this.loginPage.verifyLoginPageTitle();
    }

    /**
     * Enter username and password
     */
    @step('Enter Username and Password')
    async enterCredentials(credentials: { username: string; password: string }): Promise<void> {
        await this.loginPage.enterUsername(credentials.username);
        await this.loginPage.enterPassword(credentials.password);
    }

    /**
     * Click login button
     */
    @step('Click Login button')
    async clickLoginButton(): Promise<void> {
        await this.loginPage.clickLogin();
    }

    /**
     * Perform complete login flow
     */
    @step('Login to Wikipedia')
    async login(credentials: { username: string; password: string }): Promise<void> {
        await this.enterCredentials(credentials);
        await this.clickLoginButton();
    }

    /**
     * Verify user is logged in
     */
    @step('Verify logged in as "{0}"')
    async verifyLoggedIn(expectedUsername: string): Promise<void> {
        await this.navigationMenu.verifyUsernameDisplayed(expectedUsername);
        await this.navigationMenu.verifyLogInLinkIsHidden();
    }

    /**
     * Perform logout
     */
    @step('Logout from Wikipedia')
    async logout(): Promise<void> {
        await this.navigationMenu.openPersonalToolsDropdown();
        await this.navigationMenu.clickLogOut();
    }
}
```

---

## Usage in Tests

```typescript
import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';

test.describe('Wikipedia Login Tests', () => {
    test('Login with valid credentials', async ({ 
        wikipediaLoginSteps,
        wikipediaMainPage
    }) => {
        await wikipediaMainPage.navigate();
        await wikipediaLoginSteps.navigateToLogin();
        await wikipediaLoginSteps.verifyPageOpened();
        await wikipediaLoginSteps.login(getWikipediaCredentials());
        await wikipediaLoginSteps.verifyLoggedIn(getWikipediaCredentials().username);
    });

    test('Login with invalid credentials shows error', async ({ 
        wikipediaLoginSteps,
        wikipediaMainPage
    }) => {
        await wikipediaMainPage.navigate();
        await wikipediaLoginSteps.navigateToLogin();
        await wikipediaLoginSteps.login({ username: 'invalid_user', password: 'wrong_password' });
        // Verify error message displayed
    });
});
```

---

## Fixture Registration

```typescript
// tests/fixtures/steps.fixture.ts
import { test as apiTest } from './api.fixture';
import { WikipediaLoginSteps } from '@steps/WikipediaLoginSteps';

type StepsFixtures = {
    wikipediaLoginSteps: WikipediaLoginSteps;
};

export const test = apiTest.extend<StepsFixtures>({
    wikipediaLoginSteps: async ({ wikipediaLoginPage, wikipediaNavigationMenu }, use) => {
        await use(new WikipediaLoginSteps(wikipediaLoginPage, wikipediaNavigationMenu));
    },
});
```

---

## Composite Methods Pattern

Combine related actions that are frequently used together.

```typescript
// ❌ VERBOSE: Separate calls for related actions
await steps.verifyPopupDisplayed(message);
await steps.clickGotIt();
await steps.verifyPopupClosed();

// ✅ BETTER: Single composite method
await steps.verifyAndDismissPopup(message);
```

**Implementation:**
```typescript
/**
 * Verify popup and dismiss it
 */
@step('Verify and dismiss popup with text "{0}"')
async verifyAndDismissPopup(expectedText: string): Promise<void> {
    await this.verifyPopupDisplayed(expectedText);
    await this.clickDismiss();
    await this.verifyPopupHidden();
}
```

---

## Multiple Page Objects Pattern

Steps that span multiple pages receive all required Page Objects via constructor:

```typescript
import { WikipediaMainPage } from '@pages/WikipediaMainPage';
import { WikipediaLoginPage } from '@pages/WikipediaLoginPage';
import { WikipediaNavigationMenu } from '@pages/WikipediaNavigationMenu';
import { step } from '@utils/decorators';

export class WikipediaAuthSteps {
    constructor(
        private readonly mainPage: WikipediaMainPage,
        private readonly loginPage: WikipediaLoginPage,
        private readonly navigationMenu: WikipediaNavigationMenu
    ) {}

    /**
     * Complete login flow from main page
     */
    @step('Login from main page with "{0}"')
    async loginFromMainPage(username: string, password: string): Promise<void> {
        await this.mainPage.navigate();
        await this.navigationMenu.clickLogIn();
        await this.loginPage.enterUsername(username);
        await this.loginPage.enterPassword(password);
        await this.loginPage.clickLogin();
    }

    /**
     * Complete logout flow
     */
    @step('Logout and verify')
    async logoutAndVerify(): Promise<void> {
        await this.navigationMenu.openPersonalToolsDropdown();
        await this.navigationMenu.clickLogOut();
        await this.navigationMenu.verifyLogInLinkDisplayed();
    }
}
```

---

## Why Parameterized Methods?

| Benefit | Description |
|---------|-------------|
| **Versatile** | Same method works for valid/invalid/edge case data |
| **Testable** | Easy to test different scenarios |
| **Reusable** | No duplication for different data sets |
| **Data-Driven** | Perfect for parameterized tests |
| **Clear** | Test controls what data to use |

---

## Anti-Patterns to Avoid

### ❌ Reading Secrets Inside Steps

```typescript
// ❌ BAD: Reading secrets inside Steps
import { getWikipediaCredentials } from '@utils/secrets';

@step('Authenticate user')
async authenticateUser(): Promise<void> {
    const { username, password } = getWikipediaCredentials();  // DON'T DO THIS
    await this.loginPage.enterUsername(username);
    await this.loginPage.enterPassword(password);
}

// ✅ GOOD: Accept credentials as parameters
@step('Authenticate user "{0}"')
async authenticateUser(username: string, password: string): Promise<void> {
    await this.loginPage.enterUsername(username);
    await this.loginPage.enterPassword(password);
}
```

**Usage in tests:**
```typescript
// Tests pass credentials object directly to Steps
await wikipediaAuthSteps.authenticateUser(getWikipediaCredentials());
```

### ❌ Creating Page Objects Inside Steps

```typescript
// ❌ BAD: Creating PO inside Steps (violates DI)
export class BadLoginSteps {
    constructor(private readonly page: Page) {}

    @step('Login')
    async login(credentials: { username: string; password: string }): Promise<void> {
        const loginPage = new WikipediaLoginPage(this.page);  // DON'T DO THIS
        await loginPage.enterUsername(credentials.username);
    }
}
```

### ❌ Missing `@step` Decorator

```typescript
// ❌ BAD: Missing decorator - won't appear in reports
async login(credentials: { username: string; password: string }): Promise<void> {
    await this.loginPage.enterUsername(credentials.username);
    await this.loginPage.enterPassword(credentials.password);
}
```

### ❌ Missing JSDoc Comments

```typescript
// ❌ BAD: No JSDoc
@step('Login')
async login(credentials: { username: string; password: string }): Promise<void> {
    // ...
}

// ✅ GOOD: With JSDoc
/**
 * Perform login with credentials
 */
@step('Login to Wikipedia')
async login(credentials: { username: string; password: string }): Promise<void> {
    // ...
}
```

---

## Best Practices Summary

| Practice | Description |
|----------|-------------|
| `private readonly` | Constructor parameters with proper visibility |
| `@step` decorator | On ALL public methods |
| JSDoc comments | On methods with non-obvious behavior |
| Parameters | Accept data (including credentials) as method parameters |
| DI pattern | Receive Page Objects via constructor |
| Composite methods | Combine frequently-used action sequences |
| No internal secrets | Never read secrets inside Steps |

---

**📘 See also:**
- [step-definition.md](../patterns/step-definition.md) - Step definitions pattern
- [complete-test-example.md](complete-test-example.md) - Full test example
- [reporting-example.md](reporting-example.md) - How steps appear in reports
