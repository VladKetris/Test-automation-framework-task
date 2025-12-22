# Step Definitions Pattern

The layer where Gherkin steps are mapped to Playwright code.

---

## Responsibility

- Receive Gherkin step inputs (strings, data tables)
- Map inputs to Page Object actions
- Assert expected outcomes
- **Do NOT** contain locator definitions (keep in Page Objects)

## Dependency Injection

Step classes receive Page Objects via **constructor injection from fixtures**, ensuring the "Single Page Object Instance" rule (DRY).

```typescript
// tests/steps/WikipediaLoginSteps.ts

export class WikipediaLoginSteps {
    // ✅ Receive Page Object via constructor injection (from fixtures)
    constructor(
        readonly loginPage: WikipediaLoginPage
    ) { }

    @step('Login with valid credentials')
    async loginValid(username: string, password: string): Promise<void> {
        await this.loginPage.enterUsername(username);
        await this.loginPage.enterPassword(password);
        await this.loginPage.clickLogin();
    }
}
```

## Structure

```typescript
import { WikipediaLoginPage } from '@pages/WikipediaLoginPage';
import { step } from '@utils/decorators';

export class WikipediaLoginSteps {
    // 1. Dependency Injection - receive Page Objects from fixtures
    constructor(readonly loginPage: WikipediaLoginPage) { }

    // 2. Step implementation with @step decorator
    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
        await this.loginPage.verifyLoginPageTitle();
    }
    
    // 3. Complex logic using atomic PO methods
    @step('Login to Wikipedia with "{0}"')
    async login(username: string, password: string): Promise<void> {
        await this.loginPage.enterUsername(username);
        await this.loginPage.enterPassword(password);
        await this.loginPage.clickLogin();
    }
}
```

## Registration in Fixtures

Steps are registered in `steps.fixture.ts` and receive their dependencies from `api.fixture.ts` (which extends `pages.fixture.ts`).

```typescript
// fixtures/steps.fixture.ts
export const test = apiTest.extend<StepsFixtures>({
    wikipediaLoginSteps: async ({ wikipediaLoginPage }, use) => {
        // Steps instance created with injected Page Object
        await use(new WikipediaLoginSteps(wikipediaLoginPage));
    },
});
```

---

## Rules

| Rule | Reason |
|------|--------|
| ✅ Receive PO via constructor | DRY: Single instance per test |
| ✅ Use `@step` decorator | Clear reporting in HTML report |
| ✅ Use parameters | Reusability (e.g., `enterCredentials(user, pass)`) |
| ❌ No locators in Steps | Maintainability (keep in PO) |
| ❌ No `new PageObject()` | Violation of DI pattern |

---

## Usage in Tests

```typescript
// tests/specs/login.spec.ts
import { test } from '@fixtures';

test('Login flow', async ({ wikipediaLoginSteps }) => {
    // Use the Steps instance directly
    await wikipediaLoginSteps.verifyPageOpened();
});
```
