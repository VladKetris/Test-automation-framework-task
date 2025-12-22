# Steps Class Example

## TypeScript Implementation

### ✅ RECOMMENDED: Dependency Injection with Parameterized Methods

Steps classes receive Page Objects via constructor injection (from fixtures) and accept data as parameters.

```typescript
import { WikipediaLoginPage } from "@pages/WikipediaLoginPage";
import { step } from "@utils/decorators";

export class WikipediaLoginSteps {
    // ✅ Receive Page Objects via constructor injection (from fixtures)
    constructor(
        readonly loginPage: WikipediaLoginPage
    ) { }

    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.loginPage.verifyPageOpened();
        await this.loginPage.verifyLoginPageTitle();
    }

    // ✅ Atomic: accepts credentials as parameters
    @step('Enter Username "{0}" and Password on the Login Page')
    async enterCredentials(username: string, password: string): Promise<void> {
        await this.loginPage.enterUsername(username);
        await this.loginPage.enterPassword(password);
    }

    @step('Click "Log in" on the Login Page')
    async clickLoginButton(): Promise<void> {
        await this.loginPage.clickLogin();
    }

    // ✅ Composite: combines enterCredentials + clickLoginButton
    @step('Login to Wikipedia with "{0}"')
    async login(username: string, password: string): Promise<void> {
        await this.enterCredentials(username, password);
        await this.clickLoginButton();
    }
}
```

### Usage in Tests

```typescript
import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';

test.describe('Wikipedia Login Tests', () => {
    test('Login with valid credentials', async ({ 
        wikipediaNavigationMenu,  // PO for atomic action
        wikipediaLoginSteps,
        wikipediaMainPage         // PO for atomic verification
    }) => {
        const { username, password } = getWikipediaCredentials();
        
        // PO: atomic click
        await wikipediaNavigationMenu.clickLogIn();
        
        // Steps: business logic
        await wikipediaLoginSteps.verifyPageOpened();
        await wikipediaLoginSteps.login(username, password);
        
        // PO: atomic verification
        await wikipediaMainPage.verifyPageOpened();
    });

    test('Login with invalid credentials', async ({ 
        wikipediaNavigationMenu,  // PO for atomic action
        wikipediaLoginSteps 
    }) => {
        await wikipediaNavigationMenu.clickLogIn();  // PO: atomic click
        await wikipediaLoginSteps.login('invalid_user', 'wrong_password');  // Steps: business
        // Verify error message
    });
});
```

## Fixture Registration

```typescript
// tests/fixtures/steps.fixture.ts
import { test as apiTest } from "./api.fixture";
import { WikipediaLoginSteps } from "@steps/WikipediaLoginSteps";

type StepsFixtures = {
    wikipediaLoginSteps: WikipediaLoginSteps;
};

// ✅ Steps receive Page Objects via dependency injection
export const test = apiTest.extend<StepsFixtures>({
    // Page Objects are injected from pages.fixture.ts (via api.fixture.ts chain)
    wikipediaLoginSteps: async ({ wikipediaLoginPage }, use) => {
        await use(new WikipediaLoginSteps(wikipediaLoginPage));
    },
});
```

## Composite Methods Pattern

**Rule:** Combine related actions that are frequently used together.

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
@step('Verify and dismiss popup with text "{0}"')
async verifyAndDismissPopup(expectedText: string): Promise<void> {
    await this.verifyPopupDisplayed(expectedText);  // Reuse existing
    await this.clickDismiss();                       // Reuse existing
    await this.verifyPopupHidden();                  // Verify final state
}
```

## Why Parameterized Methods?

✅ **Versatile** - Same method works for valid/invalid/edge case data  
✅ **Testable** - Easy to test different scenarios  
✅ **Reusable** - No duplication for different data sets  
✅ **Data-Driven** - Perfect for parameterized tests  
✅ **Clear** - Test controls what data to use  

## Anti-Pattern to Avoid

❌ **DON'T hardcode or read from secrets inside Steps:**

```typescript
// ❌ BAD: Hardcoded, inflexible
@step("Login")
async login(): Promise<void> {
    const username = process.env.USERNAME; // DON'T DO THIS
    const password = "hardcoded123";        // DON'T DO THIS
    
    await this.loginPage.enterUsername(username);
    await this.loginPage.enterPassword(password);
}
```

This makes the method:
- Only work with one set of credentials
- Impossible to test invalid credentials
- Not reusable across different test scenarios
