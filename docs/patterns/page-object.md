# Page Object Pattern

**Location:** `tests/pages/` directory

**📘 Full Example:** [page-object-example.md](../examples/page-object-example.md)
**📘 Locator Extraction:** [locators.md](locators.md)

---

## Rules

1.  **🔴 CHECK [page-object-map.md](../maps/page-object-map.md) FIRST** - Never create without checking
2.  **🔴 MANDATORY: Locator Verification** - **ALL new locators MUST be verified using MCP browser tools**:
    - Use `mcp_playwright_browser_navigate` to navigate to target page
    - Use `mcp_playwright_browser_snapshot` to see page structure
    - Use `mcp_playwright_browser_evaluate` to verify uniqueness (must return exactly 1 element)
    - **❌ NEVER create locators without MCP verification** - See [locators.md](locators.md) for full process
3.  **Inherit from `BasePage`**
4.  **ONE locator per element** - Most reliable verified locator only (verified via MCP)
5.  **Locator reuse** - Prefer existing locators and extend existing Page Objects when needed
6.  **Direct Playwright API** - Use `Locator` for elements, BasePage methods for checks, `.describe()` for debugging
7.  **Atomic Actions** - Expose simple actions (click, type, get text), NOT complex business logic
8.  **Search existing first** - No duplicates allowed
9.  **ONE Page Object per unique page/URL**
10. **Consumed by Steps** - Page Objects are used by Steps classes. Direct usage in Tests is PROHIBITED.
11. **UPDATE page-object-map.md** - Immediately after creation
12. **🔴 POPUPS get separate Page Objects** - Always create a dedicated `*PopupPage` class for popups/modals. Small popups don't require separate Steps classes - integrate into parent Steps.
13. **🔴 NEVER duplicate BasePage methods** - **NEVER override `verifyPageOpened()`**. Ensure the `formLocator` passed to `super()` is the correct unique page identifier, and use the inherited method. Don't create methods like `verifyPopupVisible()`.
14. **🔴 UNIQUE formLocator REQUIRED** - The `formLocator` passed to `super()` **MUST be unique to that specific page type** and **MUST NOT appear on other pages**. Use MCP browser tools to verify:
    - Navigate to the target page and verify the locator exists (returns exactly 1 element)
    - Navigate to similar/related pages (e.g., Main Page vs Article Page) and verify the locator does NOT exist (returns 0 elements)
    - Prefer simple, semantic locators (e.g., `page.getByRole('link', { name: 'Edit' })`) over complex structural selectors
    - **Example:** Article pages use "Edit" link (unique), Main Page uses "View source" (different) - verify both pages to ensure uniqueness
15. **🔴 Expect assertions in BasePage** - Any verification using Playwright expect matchers (like `toHaveTitle`, `toBeVisible`, `toHaveText`, etc.) must be added to `BasePage` as a generic method. Page Objects should call the BasePage method, not use `expect()` directly.
16. **JSDoc on complex methods** - Methods with non-obvious behavior should have JSDoc comments. Simple self-documenting methods (like `clickLogin()`) may omit JSDoc if the method name clearly conveys intent.
17. **🔴 Page Object-specific constants** - Constants specific to a Page Object (like page titles, specific text values) must be stored as constants at the top of the Page Object file. Use UPPER_SNAKE_CASE naming.
18. **🔴 Locator extraction process** - Follow [locators.md](locators.md) methodology for creating new locators. **MCP verification is MANDATORY** - Always verify uniqueness before implementation.
19. **🔴 Dynamic locators as arrow functions** - For parameterized locators (by index, text, etc.), use arrow function class properties instead of inline creation in methods. **Use dynamic locators directly** - Call the arrow function directly in methods (e.g., `this.paragraphs(index)`), do not create intermediate variables or helper methods.
20. **🔴 No unused methods** - Never create methods that are not used in tests. Remove unused methods immediately. Check usage before creating new methods.

---

## Popup Page Objects

**Naming:** `*PopupPage.ts` (e.g., `WikipediaGetStartedPopupPage.ts`)

**Rules:**
- Always create a separate Page Object for popups/modals
- Use `PopupPage` suffix in class name
- **Use `formLocator` as the container** - Don't create separate container locators
- Small popups: integrate into parent Steps class (no separate Steps)
- Large/complex popups: may warrant their own Steps class

```typescript
export class ConfirmDialogPopupPage extends BasePage {
    private readonly confirmButton: Locator;
    private readonly cancelButton: Locator;

    constructor(page: Page) {
        // formLocator IS the popup container - no separate container needed
        super(page, page.locator('.dialog-popup'), 'ConfirmDialogPopupPage');
        this.confirmButton = page.locator('button:has-text("OK")').describe('OK button');
        this.cancelButton = page.locator('button:has-text("Cancel")').describe('Cancel button');
    }

    // ✅ Use inherited verifyPageOpened() for visibility - DON'T create verifyPopupVisible()

    async verifyPopupContainsText(expectedText: string): Promise<void> {
        await this.elementToContainText(this.formLocator, expectedText);
    }

    async clickConfirm(): Promise<void> {
        await this.confirmButton.click();
    }

    async verifyPopupHidden(): Promise<void> {
        await this.elementToBeHidden(this.formLocator);
    }
}
```

---

## JSDoc Documentation

**Rule:** Methods with non-obvious behavior should have JSDoc comments. Simple self-documenting methods may omit JSDoc.

**When to use JSDoc:**
- Methods with parameters that need explanation
- Methods with complex/multi-step behavior
- Methods where the name doesn't fully convey intent

**When to omit JSDoc:**
- Self-documenting methods like `clickLogin()`, `enterUsername()`
- Methods where the name clearly describes the action

**Examples:**

```typescript
// ✅ GOOD: JSDoc for method with parameters that need explanation
/**
 * Verify paragraph at specified index contains expected text
 * @param expectedText Expected text in paragraph
 * @param index Paragraph index (0-based, defaults to 0)
 */
async verifyParagraphContainsText(expectedText: string, index: number = 0): Promise<void> {
    const paragraph = this.paragraphs(index);
    await this.elementToContainText(paragraph, expectedText);
}

// ✅ GOOD: Self-documenting method (JSDoc optional)
async clickLogin(): Promise<void> {
    await this.loginButton.click();
}

// ✅ GOOD: Self-documenting method (JSDoc optional)
async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
}
```

**Note:** Private methods may omit JSDoc if their purpose is obvious from the method name.

---

## Page Object-Specific Constants

**Rule:** Constants specific to a Page Object (like page titles, specific text values used only in that PO) must be stored as constants at the top of the Page Object file.

**Placement:**
- Define constants before the class declaration
- Use `UPPER_SNAKE_CASE` naming
- Keep constants close to where they're used

**Examples:**

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

const LOGIN_PAGE_TITLE = /Log in/i;
const EXPECTED_ERROR_MESSAGE = 'Invalid credentials';

export class WikipediaLoginPage extends BasePage {
    // ... class implementation
    
    async verifyLoginPageTitle(): Promise<void> {
        await this.verifyPageTitle(LOGIN_PAGE_TITLE);
    }
}
```

**When to use other approaches:**
- **Multiple Page Objects** → Use test data provider or constants file
- **Multiple test files** → Use test data provider (JSON file)
- **API constants** → Use `tests/api/constants/*.ts`

---

## BasePage Assertion Methods

**Rule:** Any verification using Playwright expect matchers (like `toHaveTitle`, `toBeVisible`, `toHaveText`, etc.) must be added to `BasePage` as a generic method.

**Rationale:** Centralizes assertion logic, ensures consistent timeout handling, and provides consistent error messages across all Page Objects.

**Examples:**

```typescript
// ❌ BAD: Direct expect in Page Object
async verifyLoginPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(/Log in/i);
}

// ✅ GOOD: Use BasePage method
async verifyLoginPageTitle(): Promise<void> {
    await this.verifyPageTitle(/Log in/i);
}
```

**Available BasePage Methods:**
- `elementToBeVisible()` - Verify element is visible
- `elementToBeHidden()` - Verify element is hidden
- `elementToBeEnabled()` / `elementToBeDisabled()` - Verify element state
- `elementToBeChecked()` - Verify checkbox state
- `elementToHaveText()` - Verify exact text match
- `elementToContainText()` - Verify text contains substring
- `elementToHaveValue()` - Verify input value
- `elementToHaveAttribute()` - Verify element attribute
- `elementToHaveCss()` - Verify CSS property
- `verifyPageTitle()` - Verify page title (string or RegExp)
- `verifyPageOpened()` - Verify page is loaded (uses formLocator)

All methods support:
- `useSoftAssertions` - Use soft assertions (default: false)
- `timeout` - Override default timeout (uses assertion timeout from config by default)

---

## Before Creating

**MANDATORY STEPS:**
1.  **OPEN** `docs/maps/page-object-map.md`
2.  **SEARCH** for existing Page Objects
3.  **VERIFY** no similar page exists

```bash
# Check the map
cat docs/maps/page-object-map.md

# Search existing
grep -r "class.*Page" tests/pages/
```

**Reuse Strategy:**
Same page → extend existing | Similar page → inheritance | Different page → new class

---

## Page Object Structure

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

export class PageName extends BasePage {
    private readonly submitButton: Locator;
    private readonly messageLabel: Locator;

    constructor(page: Page) {
        super(page, page.locator("#unique-container"), "Page Name");

        // Elements - ONE locator each, use .describe() for debugging
        this.submitButton = page.locator("#submit-btn").describe("Submit button");
        this.messageLabel = page.locator(".message").describe("Message label");
    }

    /**
     * Click submit button
     */
    async clickSubmit(): Promise<void> {
        await this.submitButton.click();
    }

    /**
     * Get message text
     */
    async getMessageText(): Promise<string> {
        const text = await this.messageLabel.textContent();
        return text || "";
    }
}
```

---

## Dynamic Locators

For locators that depend on parameters (index, text, ID), use **arrow function class properties**:

```typescript
export class WikipediaArticlePage extends BasePage {
    private readonly paragraphs: (index: number) => Locator;

    constructor(page: Page) {
        super(page, page.getByRole('link', { name: 'Edit' }), 'WikipediaArticlePage');
        // ✅ Arrow function for parameterized locator
        this.paragraphs = (index: number) => 
            page.locator('#mw-content-text .mw-parser-output > p')
                .nth(index)
                .describe('Article paragraphs');
    }

    /**
     * Verify paragraph at specified index contains expected text
     */
    async verifyParagraphContainsText(expectedText: string, index: number = 0): Promise<void> {
        // ✅ Use dynamic locator directly - no intermediate variables
        const paragraph = this.paragraphs(index);
        await this.elementToBeVisible(paragraph);
        await this.elementToContainText(paragraph, expectedText);
    }
}
```

**Why arrow functions?**
- Locators stay centralized in class properties
- Reusable across multiple methods
- Easy to compose (e.g., `getCell` uses `getRow`)
- Consistent with static locator pattern

**🔴 Use dynamic locators directly:**
- ✅ **GOOD**: Call the arrow function directly in methods (e.g., `this.paragraphs(index)`)
- ❌ **BAD**: Creating intermediate helper methods (e.g., `getParagraph(index)`)
- ❌ **BAD**: Creating locator inline in method without arrow function property

**❌ Avoid patterns:**
```typescript
// BAD: Intermediate helper method
private readonly getParagraph = (index: number): Locator =>
    this.paragraphs.nth(index);

async verifyParagraphContainsText(expectedText: string, index: number = 0): Promise<void> {
    const paragraph = this.getParagraph(index); // ❌ Don't create helper methods
    await this.elementToBeVisible(paragraph);
}

// BAD: Creating locator inline in method
async verifyParagraphContainsText(expectedText: string, index: number = 0): Promise<void> {
    const paragraph = page.locator('#mw-content-text .mw-parser-output > p').nth(index); // ❌ Don't create inline
    await this.elementToBeVisible(paragraph);
}
```

---

## Success Criteria

-   ✅ Existing Page Objects searched and reused
-   ✅ ONE verified locator per element
-   ✅ Reuses existing locators and keeps them centralized in Page Objects
-   ✅ Playwright `Locator` used for all elements
-   ✅ All locators have `.describe()` for debugging
-   ✅ Dynamic locators use arrow function class properties
-   ✅ BasePage check methods used for validations
-   ✅ Atomic public API
-   ✅ No duplicate functionality
-   ✅ ONE Page Object per unique page/URL
-   ✅ Consumed by Steps classes
-   ✅ [page-object-map.md](../maps/page-object-map.md) updated
