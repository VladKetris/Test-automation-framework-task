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
    constructor(
        private readonly loginPage: WikipediaLoginPage
    ) {}

    /**
     * Perform login with credentials
     */
    @step('Login to Wikipedia')
    async login(credentials: { username: string; password: string }): Promise<void> {
        await this.loginPage.enterUsername(credentials.username);
        await this.loginPage.enterPassword(credentials.password);
        await this.loginPage.clickLogin();
    }
}
```

## Structure

```typescript
import { WikipediaLoginPage } from '@pages/WikipediaLoginPage';
import { step } from '@utils/decorators';

export class WikipediaLoginSteps {
    constructor(
        private readonly loginPage: WikipediaLoginPage
    ) {}

    /**
     * Verify login page is displayed
     */
    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
        await this.loginPage.verifyLoginPageTitle();
    }
    
    /**
     * Perform login with credentials
     */
    @step('Login to Wikipedia')
    async login(credentials: { username: string; password: string }): Promise<void> {
        await this.loginPage.enterUsername(credentials.username);
        await this.loginPage.enterPassword(credentials.password);
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
| ✅ `private readonly` for PO | Proper encapsulation |
| ✅ `@step` decorator on ALL methods | Clear reporting in HTML report |
| ✅ JSDoc on complex methods | Documentation for non-obvious behavior |
| ✅ Accept data as parameters | Reusability across scenarios |
| ✅ Accept credentials as parameters | Never read secrets internally |
| ❌ No locators in Steps | Maintainability (keep in PO) |
| ❌ No `new PageObject()` | Violation of DI pattern |
| ❌ No hardcoded data | Flexibility for different test cases |
| ❌ No reading secrets internally | Tests pass credentials to Steps |

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
