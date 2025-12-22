# Locator Extraction Example

Complete walkthrough of extracting locators for a real element following [locators.md](../patterns/locators.md) methodology.

## Scenario

Extract locator for the **Username Input** field on Wikipedia Login Page.

---

## Step 1: Check Existing Locators

```bash
# Search existing Page Objects
grep -r "wpName\|username" tests/pages/
```

**Result:** Found in `WikipediaLoginPage.ts`:
```typescript
this.usernameInput = page.locator('input#wpName1').describe('Username input');
```

**Decision:** Locator exists → **USE IT, don't create new**

---

## Step 2: MCP Visual Analysis (For New Locators)

When no existing locator is found, use MCP for visual analysis:

```
# Navigate to Wikipedia login page
mcp_playwright_browser_navigate → url: "https://en.wikipedia.org/w/index.php?title=Special:UserLogin"

# Take snapshot for visual confirmation
mcp_playwright_browser_snapshot
```

**Visual Confirmation:**
- Element: Text input field for username
- Location: Login form, first input field
- Container: Form with ID `userloginForm`
- State: Visible, enabled, accepts input

---

## Step 3: Container HTML Investigation

Extract COMPLETE container DOM (not just target element):

```
# Extract container HTML via MCP
mcp_playwright_browser_evaluate → function: "document.querySelector('#userloginForm').innerHTML"
```

**Container HTML:**
```html
<form name="userlogin" id="userloginForm" class="mw-htmlform" method="post">
    <div class="mw-htmlform-field">
        <label for="wpName1">Username</label>
        <input type="text"
               id="wpName1"
               name="wpName"
               class="mw-userlogin-username cdx-text-input__input"
               autocomplete="username"
               placeholder="Enter your username"
               tabindex="1"
               autofocus>
    </div>
    <div class="mw-htmlform-field">
        <label for="wpPassword1">Password</label>
        <input type="password"
               id="wpPassword1"
               name="wpPassword"
               class="mw-userlogin-password cdx-text-input__input"
               autocomplete="current-password"
               tabindex="2">
    </div>
    <button id="wpLoginAttempt" type="submit" tabindex="3">
        Log in
    </button>
</form>
```

**Key Observations:**
- Unique ID: `wpName1` (stable, not auto-generated)
- Name attribute: `wpName` (stable)
- ARIA/Label: Associated `<label for="wpName1">`
- Classes: `mw-userlogin-username` (semantic), `cdx-text-input__input` (framework class)

---

## Step 4: Priority Strategy

Create multiple options, verify uniqueness:

```
# Option 1: Role + accessible name (Priority 1)
mcp_playwright_browser_evaluate → function: "document.querySelectorAll('[role=\"textbox\"]').length"
# Result: Multiple textboxes on page - need more specificity

# Option 2: ID selector (Priority 2)
mcp_playwright_browser_evaluate → function: "document.querySelectorAll('#wpName1').length"
# Result: 1 ✅ UNIQUE

# Option 3: Name attribute (Priority 5)
mcp_playwright_browser_evaluate → function: "document.querySelectorAll('[name=\"wpName\"]').length"
# Result: 1 ✅ UNIQUE

# Option 4: Class selector
mcp_playwright_browser_evaluate → function: "document.querySelectorAll('.mw-userlogin-username').length"
# Result: 1 ✅ UNIQUE (but class may change)
```

**Options Ranked:**

| Option | Locator | Priority | Unique | Stable | Selected |
|--------|---------|:--------:|:------:|:------:|:--------:|
| 1 | `getByRole('textbox', { name: 'Username' })` | 1 | ❌ | ✅ | No |
| 2 | `input#wpName1` | 2 | ✅ | ✅ | **Yes** |
| 3 | `[name="wpName"]` | 5 | ✅ | ✅ | Backup |
| 4 | `.mw-userlogin-username` | 6 | ✅ | ⚠️ | No |

---

## Step 5: Validation

### Uniqueness Verification

```
# Verify via MCP
mcp_playwright_browser_evaluate → function: "document.querySelectorAll('input#wpName1').length"
# Returns: 1 ✅
```

### Verification Table

| Locator | Page State | Match Count | Result |
|---------|------------|:-----------:|:------:|
| `input#wpName1` | Login Page | 1 | ✅ |
| `input#wpName1` | After failed login | 1 | ✅ |
| `input#wpName1` | Mobile viewport | 1 | ✅ |

### Stability Test
- ✅ Same locator after page reload
- ✅ Same across login error states
- ✅ Independent of dynamic content
- ✅ Works on all viewport sizes

**SELECTED:** `input#wpName1`

**Reason:** Priority 2 (ID), unique, stable, short, readable.

---

## Step 6: Documentation

```markdown
### Target Element: Username Input

**Visual Analysis:**
- Location: Login form, first input field
- Container: Form with ID `userloginForm`
- State: Visible, enabled, autofocused

**Container HTML:**
```html
<form id="userloginForm">
    <input type="text" id="wpName1" name="wpName" ...>
</form>
```

**Selected Locator:** `input#wpName1`
- **Type:** ID selector
- **Priority:** 2
- **Verified:** Unique ✅, Stable ✅

**Alternatives Considered:**
- `[name="wpName"]` - Valid but less readable
- `.mw-userlogin-username` - Class may change
- `getByRole('textbox')` - Not unique on page
```

---

## Step 7: Implementation in Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

const LOGIN_PAGE_TITLE = /Log in/i;

export class WikipediaLoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page, page.locator('input#wpName1'), 'WikipediaLoginPage');

        // ONE verified locator per element, with .describe() for debugging
        this.usernameInput = page.locator('input#wpName1')
            .describe('Username input');
        this.passwordInput = page.locator('input#wpPassword1')
            .describe('Password input');
        this.loginButton = page.locator('button#wpLoginAttempt')
            .describe('Login button');
    }

    /**
     * Enter username
     */
    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameInput);
        await this.usernameInput.fill(username);
    }

    /**
     * Enter password
     */
    async enterPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.passwordInput);
        await this.passwordInput.fill(password);
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.elementToBeVisible(this.loginButton);
        await this.loginButton.click();
    }

    /**
     * Verify login page title
     */
    async verifyLoginPageTitle(): Promise<void> {
        await this.verifyPageTitle(LOGIN_PAGE_TITLE);
    }
}
```

---

## Additional Example: Role-Based Locator

For elements with good accessibility attributes, prefer role-based locators:

### Target: Personal Tools Button

```
# MCP Visual Analysis
mcp_playwright_browser_snapshot

# Container HTML extraction
mcp_playwright_browser_evaluate → function: "document.querySelector('#p-personal').outerHTML"
```

**HTML:**
```html
<div id="p-personal">
    <button role="button" aria-haspopup="true">
        Personal tools
    </button>
</div>
```

**Best Locator:**
```typescript
this.personalToolsButton = page.getByRole('button', { name: 'Personal tools' })
    .describe('Personal tools dropdown button');
```

**Why Role-Based:**
- Priority 1 (highest)
- Semantic and accessible
- Resilient to HTML changes
- Self-documenting

---

## Key Takeaways

1. **Always check existing locators first** - Reuse before creating new
2. **Start with MCP visual analysis** - Visual confirmation prevents wrong targets
3. **Extract full container HTML** - Context is critical for stable locators
4. **Create multiple options** - Then select ONE BEST based on priority
5. **Verify uniqueness via MCP** - Always confirm count = 1
6. **ONE locator in Page Object** - No fallback logic
7. **Always use `.describe()`** - Better debugging and error messages
8. **Use `private readonly`** - Proper encapsulation
9. **Add JSDoc comments** - Document all public methods

**Time invested:** 10 minutes
**Stability gained:** High (ID-based, verified unique)
**Maintenance:** Minimal (semantic, readable)

---

**See methodology:** [locators.md](../patterns/locators.md)
