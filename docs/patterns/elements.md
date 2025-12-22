# Framework Elements

This document describes how to work with page elements in the framework using Playwright's Locator API directly, combined with centralized check methods from `BasePage`.

**📘 Usage Example:** [page-object-example.md](../examples/page-object-example.md)
**📘 Locator Extraction:** [locators.md](locators.md) | [locator-extraction-example.md](../examples/locator-extraction-example.md)

---

## Architecture Overview

The framework follows a **hybrid approach** for element handling:

1. **Direct Playwright API**: Use Playwright's `Locator` directly for all element interactions (click, fill, hover, etc.)
2. **Centralized Checks**: Use `BasePage` protected methods for all element state validations (visibility, text, attributes, etc.)

This approach provides:
- Direct access to Playwright's powerful Locator API
- Consistent error messaging through `BasePage` check methods
- Type safety with TypeScript
- Clear separation between assertions and actions

---

## BasePage Check Methods

All Page Objects extend `BasePage`, which provides protected methods for element state verification:

### Visibility & Display
- `elementToBeVisible(element, useSoftAssertions?, timeout?)` - Verify element is visible
- `elementToBeHidden(element, useSoftAssertions?, timeout?)` - Verify element is hidden

### State Checks
- `elementToBeEnabled(element, useSoftAssertions?, timeout?)` - Verify element is enabled
- `elementToBeDisabled(element, useSoftAssertions?, timeout?)` - Verify element is disabled
- `elementToBeChecked(element, useSoftAssertions?, timeout?)` - Verify checkbox/radio is checked

### Content Verification
- `elementToHaveText(element, text, useSoftAssertions?, timeout?)` - Verify element has exact text
- `elementToContainText(element, text, useSoftAssertions?, timeout?)` - Verify element contains text
- `elementToHaveValue(element, expectedValue, useSoftAssertions?, timeout?)` - Verify input/textarea value
- `elementToHaveAttribute(element, attribute, expectedValue, useSoftAssertions?, timeout?)` - Verify attribute value
- `elementToHaveCss(element, cssProperty, expectedValue, useSoftAssertions?, timeout?)` - Verify CSS property

### Page-Level Verification
- `verifyPageOpened(useSoftAssertions?, timeout?)` - Verify page is loaded (checks formLocator)
- `verifyPageTitle(title, useSoftAssertions?, timeout?)` - Verify page title matches (string or RegExp)

### Parameters
- `element: Locator` - The Playwright Locator to check
- `useSoftAssertions: boolean` - Use soft assertion (default: `false` for most methods, `true` for `elementToHaveCss`)
- `timeout?: number` - Custom timeout in milliseconds (defaults to environment assertion timeout)

All methods return the `Locator` for method chaining.

---

## Usage in Page Objects

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    private readonly usernameField: Locator;
    private readonly passwordField: Locator;
    private readonly submitButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page, page.locator("#loginForm"), "LoginPage");

        // Declare elements as Locators with .describe()
        this.usernameField = page.locator("#username").describe("Username field");
        this.passwordField = page.locator("#password").describe("Password field");
        this.submitButton = page.locator("button[type='submit']").describe("Submit button");
        this.errorMessage = page.locator(".error-message").describe("Error message");
    }

    /**
     * Enter username
     */
    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameField);
        await this.usernameField.fill(username);
    }

    /**
     * Enter password
     */
    async enterPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.passwordField);
        await this.passwordField.fill(password);
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.elementToBeVisible(this.submitButton);
        await this.submitButton.click();
    }

    /**
     * Verify error message is displayed
     */
    async verifyErrorDisplayed(expectedError: string): Promise<void> {
        await this.elementToBeVisible(this.errorMessage);
        await this.elementToHaveText(this.errorMessage, expectedError);
    }
}
```

### Locator Patterns

The framework supports multiple locator strategies. See [locators.md](locators.md) for full extraction methodology and priority order:

#### CSS Selectors
```typescript
this.usernameInput = page.locator('input#wpName1').describe('Username input');
this.passwordInput = page.locator('input#wpPassword1').describe('Password input');
this.loginButton = page.locator('button#wpLoginAttempt').describe('Login button');
```

#### Role-Based Locators (Recommended for Accessibility)
```typescript
this.personalToolsButton = page.getByRole('button', { name: 'Personal tools' }).describe('Personal tools dropdown button');
this.logOutLink = page.getByRole('link', { name: 'Log out' }).describe('Log out link');
```

#### XPath Selectors (Use Sparingly)
```typescript
this.hideMainMenuLink = page.locator('//button[@data-event-name="pinnable-header.vector-main-menu.unpin"]').describe('Hide main menu link');
```

#### Attribute Selectors
```typescript
this.createNewPageSidebarLink = page.locator("a[href='/wiki/Wikipedia:Create_a_new_page']").describe('Create a new page sidebar link');
```

### Using `.describe()` for Debugging

Always use Playwright's `.describe()` method to add human-readable descriptions to locators for better error messages and debugging:

```typescript
export class LoginPage extends BasePage {
    private readonly usernameField: Locator;
    private readonly submitButton: Locator;

    constructor(page: Page) {
        super(page, page.locator("#loginForm"), "LoginPage");

        // Add descriptions to locators
        this.usernameField = page.locator("#username").describe("Username input field");
        this.submitButton = page.locator("button[type='submit']").describe("Login submit button");
    }

    /**
     * Enter username
     */
    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameField);
        await this.usernameField.fill(username);  // Error: "Username input field" not found
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.elementToBeVisible(this.submitButton);
        await this.submitButton.click();  // Error: "Login submit button" not found
    }
}
```

---

## Common Interaction Patterns

### Clicking Elements
```typescript
// Simple click
await this.submitButton.click();

// Right click
await this.menuItem.click({ button: 'right' });

// Double click
await this.fileItem.dblclick();

// Click with modifier keys
await this.link.click({ modifiers: ['Control'] });
```

### Input Fields
```typescript
// Fill input
await this.usernameField.fill("user@example.com");

// Clear and fill
await this.searchBox.clear();
await this.searchBox.fill("new query");

// Type with delay
await this.textArea.type("Hello", { delay: 100 });
```

### Dropdowns & Selection
```typescript
// Select by value
await this.countryDropdown.selectOption("US");

// Select by label
await this.countryDropdown.selectOption({ label: "United States" });

// Get selected value
const selected = await this.countryDropdown.inputValue();
```

### Checkboxes & Radio Buttons
```typescript
// Check/uncheck
await this.agreeCheckbox.check();
await this.agreeCheckbox.uncheck();

// Verify state using BasePage method
await this.elementToBeChecked(this.agreeCheckbox);
```

### Hover & Focus
```typescript
// Hover over element
await this.menuItem.hover();

// Focus element
await this.inputField.focus();
```

### Drag and Drop
```typescript
// Drag to another element
await this.dragHandle.dragTo(this.dropZone);
```

### Getting Element Data
```typescript
// Get text content
const text = await this.label.textContent();

// Get inner text
const innerText = await this.label.innerText();

// Get attribute
const href = await this.link.getAttribute("href");

// Get input value
const value = await this.textField.inputValue();

// Check visibility state
const isVisible = await this.element.isVisible();
```

### Verifying Element Values
```typescript
// Verify input has specific value using BasePage method
await this.elementToHaveValue(this.searchInput, '');

// Verify element has exact text
await this.elementToHaveText(this.usernameLink, 'JohnDoe');

// Verify element contains text
await this.elementToContainText(this.errorMessage, 'Invalid');
```

---

## Best Practices

### ✅ DO
- Use `private readonly` for Locator declarations in Page Objects
- Use Playwright `Locator` type for all element declarations
- Initialize locators using `page.locator()`, `page.getByRole()`, or other Playwright locator methods
- Always add `.describe()` to locators for better debugging and error messages
- Use `BasePage` protected methods (`elementToBeVisible`, `elementToHaveText`, etc.) for state checks
- Use Playwright API directly for interactions (click, fill, hover, etc.)
- Prefer role-based locators (`getByRole`) for accessibility and maintainability
- Use CSS selectors for IDs and classes when role-based locators aren't suitable
- Use XPath only when CSS selectors or role-based locators are insufficient
- Rely on Playwright's built-in auto-waiting
- Use specific locators (IDs, test IDs, ARIA roles) when possible
- Search existing Page Objects for similar locator patterns
- Check element visibility before interaction when needed

### ❌ DON'T
- Create custom wrapper classes for elements
- Duplicate element declarations across pages
- Use `page.waitForTimeout()` for synchronization (use auto-waiting or specific waits)
- Bypass `BasePage` check methods for assertions
- Use overly broad selectors (e.g., `button` instead of `button[type='submit']`)
- Access internal Playwright APIs unless absolutely necessary
- Use public or protected visibility for locators (use `private readonly`)
- Skip `.describe()` on locators

---

## Migration from Wrapper Classes

If you encounter legacy code using wrapper classes like `Button`, `TextBox`, or `Label`:

**Before (Old Pattern):**
```typescript
import { Button } from "../elements/Button";
import { TextBox } from "../elements/TextBox";

readonly username: TextBox;
readonly submit: Button;

this.username = new TextBox(page, "#username", "Username field");
await this.username.clearAndType("user");
await this.submit.click();
```

**After (Current Pattern):**
```typescript
import { Locator } from "@playwright/test";

private readonly usernameField: Locator;
private readonly submitButton: Locator;

this.usernameField = page.locator("#username").describe("Username field");
await this.elementToBeVisible(this.usernameField);
await this.usernameField.fill("user");
await this.submitButton.click();
```

---

**📘 See usage in:** [page-object-example.md](../examples/page-object-example.md)
