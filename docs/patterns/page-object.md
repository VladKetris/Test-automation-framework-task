# Page Object Pattern

**Location:** `tests/pages/` directory

**📘 Full Example:** [page-object-example.md](../examples/page-object-example.md)
**📘 Locator Extraction:** [locators.md](locators.md)

---

## Rules

1.  **🔴 CHECK [page-object-map.md](../maps/page-object-map.md) FIRST** - Never create without checking
2.  **Inherit from `BasePage`**
3.  **ONE locator per element** - Most reliable verified locator only (see [locators.md](locators.md))
4.  **Locator reuse** - Prefer existing locators and extend existing Page Objects when needed
5.  **Direct Playwright API** - Use `Locator` for elements, BasePage methods for checks, `.describe()` for debugging
6.  **Atomic Actions** - Expose simple actions (click, type, get text), NOT complex business logic
7.  **Search existing first** - No duplicates allowed
8.  **ONE Page Object per unique page/URL**
9.  **Consumed by Steps** - Page Objects are used by Steps classes. Direct usage in Tests is PROHIBITED.
10. **UPDATE page-object-map.md** - Immediately after creation
11. **🔴 POPUPS get separate Page Objects** - Always create a dedicated `*PopupPage` class for popups/modals. Small popups don't require separate Steps classes - integrate into parent Steps.
12. **🔴 NEVER duplicate BasePage methods** - **NEVER override `verifyPageOpened()`**. Ensure the `formLocator` passed to `super()` is the correct unique page identifier, and use the inherited method. Don't create methods like `verifyPopupVisible()`.
13. **🔴 Expect assertions in BasePage** - Any verification using Playwright expect matchers (like `toHaveTitle`, `toBeVisible`, `toHaveText`, etc.) must be added to `BasePage` as a generic method. Page Objects should call the BasePage method, not use `expect()` directly.
14. **🔴 JSDoc on all methods** - All public methods in Page Objects must have JSDoc comments describing what they do. Use concise, action-oriented descriptions.
15. **🔴 Page Object-specific constants** - Constants specific to a Page Object (like page titles, specific text values) must be stored as constants at the top of the Page Object file. Use UPPER_SNAKE_CASE naming.
16. **🔴 Locator extraction process** - Follow [locators.md](locators.md) methodology for creating new locators. Always verify uniqueness before implementation.
17. **🔴 Dynamic locators as arrow functions** - For parameterized locators (by index, text, etc.), use arrow function class properties instead of inline creation in methods.

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

**Rule:** All public methods in Page Objects must have JSDoc comments.

**Format:**
- Use concise, action-oriented descriptions
- Start with a verb (e.g., "Click", "Enter", "Verify", "Get")
- Keep descriptions brief (one line when possible)

**Examples:**

```typescript
// ✅ GOOD: Clear, concise JSDoc
/**
 * Click submit button
 */
async clickSubmit(): Promise<void> {
    await this.submitButton.click();
}

/**
 * Enter username
 */
async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
}

/**
 * Verify page title
 */
async verifyPageTitle(): Promise<void> {
    await this.verifyPageTitle(/Expected Title/i);
}

// ❌ BAD: Missing JSDoc
async clickSubmit(): Promise<void> {
    await this.submitButton.click();
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
        await this.elementToBeVisible(this.submitButton);
        await this.submitButton.click();
    }

    /**
     * Get message text
     */
    async getMessageText(): Promise<string> {
        await this.elementToBeVisible(this.messageLabel);
        const text = await this.messageLabel.textContent();
        return text || "";
    }
}
```

---

## Dynamic Locators

For locators that depend on parameters (index, text, ID), use **arrow function class properties**:

```typescript
export class TablePage extends BasePage {
    private readonly rows: Locator;
    
    // ✅ Arrow functions for parameterized locators
    private readonly getRow = (index: number): Locator => 
        this.rows.nth(index);
    
    private readonly getCell = (row: number, col: number): Locator => 
        this.getRow(row).locator('td').nth(col);
    
    private readonly getRowByText = (text: string): Locator => 
        this.rows.filter({ hasText: text });

    constructor(page: Page) {
        super(page, page.locator('table'), 'TablePage');
        this.rows = page.locator('tbody tr').describe('Table rows');
    }

    /**
     * Click specific cell
     */
    async clickCell(row: number, col: number): Promise<void> {
        await this.getCell(row, col).click();
    }
}
```

**Why arrow functions?**
- Locators stay centralized in class properties
- Reusable across multiple methods
- Easy to compose (e.g., `getCell` uses `getRow`)
- Consistent with static locator pattern

**❌ Avoid inline locator creation:**
```typescript
// BAD: Creating locator inline in method
async clickCell(row: number, col: number): Promise<void> {
    const cell = this.rows.nth(row).locator('td').nth(col);
    await cell.click();
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
