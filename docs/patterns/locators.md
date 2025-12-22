# Locator Extraction Methodology

Universal process for creating stable, maintainable UI locators using Playwright MCP.

**📘 Full Example:** [locator-extraction-example.md](../examples/locator-extraction-example.md)

---

## Process: 6 Steps

### 1. Check Existing Locators 🚨 MANDATORY

Before creating ANY new locator:

1. **Open** [page-object-map.md](../maps/page-object-map.md)
2. **Search** existing Page Objects for similar elements
3. **Reuse** existing locators when possible

```bash
# Search existing locators
grep -r "locator\|getByRole" tests/pages/
```

**If locator exists** → Use it, don't create new
**If similar exists** → Extend existing Page Object
**If none exists** → Continue to Step 2

---

### 2. MCP Visual Analysis 🚨 MANDATORY

1. Navigate to target page via Playwright MCP
2. Take page snapshot for visual confirmation
3. Identify target element AND its container
4. Confirm element is visible and interactive

```
# Navigate to page
mcp_playwright_browser_navigate → url: "https://en.wikipedia.org/wiki/Main_Page"

# Take snapshot for visual analysis
mcp_playwright_browser_snapshot
```

**Visual Confirmation Checklist:**
- [ ] Element location identified
- [ ] Container/parent structure understood
- [ ] Element state (visible, clickable, enabled)
- [ ] Similar elements nearby (for uniqueness)

---

### 3. Container HTML Investigation

1. Extract COMPLETE parent container DOM (not just target element)
2. Use MCP browser_evaluate or snapshot
3. Understand element position in hierarchy

```
# Extract container HTML via MCP
mcp_playwright_browser_evaluate → function: "document.querySelector('#pt-login-2').outerHTML"
```

**Key Observations to Document:**
- Unique attributes (ID, data-*, name)
- ARIA roles and labels
- Class names (stable vs dynamic)
- Parent container structure

---

### 4. Priority Strategy - Create Options, Select ONE BEST

**Reliability Order (most stable first):**

| Priority | Type | Example | When to Use |
|:--------:|------|---------|-------------|
| 1 | **Role + Name** | `getByRole('button', { name: 'Log in' })` | Accessible elements with stable text |
| 2 | **ID Selectors** | `#wpName1` | Unique, non-auto-generated IDs |
| 3 | **Data Attributes** | `[data-testid="login-btn"]` | Test-specific attributes |
| 4 | **ARIA Labels** | `[aria-label="Search"]` | Elements with ARIA attributes |
| 5 | **Unique Attributes** | `[name="wpPassword"]` | Unique HTML attributes |
| 6 | **Partial Classes** | `//div[contains(@class, 'login')]` | Stable class name portions |
| 7 | **Combined** | `button#wpLoginAttempt` | Multiple attributes for uniqueness |

**Selection Criteria:**
- ✅ Highest priority from above that works
- ✅ Verified unique (returns exactly 1 element)
- ✅ Stable across page states (logged in/out)
- ✅ Shortest and most readable

**🔴 NEVER use multiple locators for same element in Page Object**

---

### 5. Validation 🚨 MANDATORY

**Browser-Based Uniqueness Check:**

```javascript
// Run via mcp_playwright_browser_evaluate
document.querySelectorAll('#wpName1').length  // Must return: 1
```

**Verification Table (document results):**

| Locator | Page State | Match Count | Result |
|---------|------------|:-----------:|:------:|
| `#wpName1` | Login Page | 1 | ✅ |
| `input[name="wpName"]` | Login Page | 1 | ✅ |
| `.mw-input` | Login Page | 3 | ❌ |

**Stability Testing:**
- [ ] Same locator after page reload
- [ ] Same across different page states
- [ ] Independent of dynamic content

---

### 6. Implementation in Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaLoginPage extends BasePage {
    private readonly usernameInput: Locator;

    constructor(page: Page) {
        super(page, page.locator('input#wpName1'), 'WikipediaLoginPage');

        // ONE verified locator per element, with .describe() for debugging
        this.usernameInput = page.locator('input#wpName1')
            .describe('Username input');
    }

    /**
     * Enter username
     */
    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameInput);
        await this.usernameInput.fill(username);
    }
}
```

**Implementation Checklist:**
- [ ] `private readonly` visibility
- [ ] `.describe()` on locator
- [ ] JSDoc comment on method
- [ ] `BasePage` methods for checks
- [ ] Path aliases for imports (`@pages`)

---

## Locator Patterns Reference

### Playwright Locator Methods

```typescript
// Role-based (Priority 1 - Recommended)
page.getByRole('button', { name: 'Log in' })
page.getByRole('link', { name: 'Create account' })
page.getByRole('textbox', { name: 'Username' })

// ID selector (Priority 2)
page.locator('#wpName1')
page.locator('input#wpPassword1')

// Data attributes (Priority 3)
page.locator('[data-testid="submit-btn"]')

// ARIA (Priority 4)
page.locator('[aria-label="Search Wikipedia"]')

// Attribute selectors (Priority 5)
page.locator('[name="wpPassword"]')
page.locator("a[href='/wiki/Main_Page']")

// XPath - use sparingly (Priority 6)
page.locator('//button[@data-event-name="submit"]')
```

### Always Add `.describe()`

```typescript
// ✅ GOOD: Descriptive locator
this.loginButton = page.locator('button#wpLoginAttempt')
    .describe('Login button');

// ❌ BAD: Missing description
this.loginButton = page.locator('button#wpLoginAttempt');
```

---

## Success Criteria

Before adding locator to Page Object:

- ✅ Existing locators checked and reused where possible
- ✅ MCP visual analysis completed
- ✅ Container HTML extracted and analyzed
- ✅ Multiple options created and evaluated
- ✅ Uniqueness verified (returns exactly 1)
- ✅ Stability tested across states
- ✅ ONE BEST locator selected
- ✅ `.describe()` added for debugging
- ✅ Documented with verification results

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Multiple locators for same element | ONE verified locator |
| Skip uniqueness validation | Always verify count = 1 |
| Use dynamic/auto-generated IDs | Use stable IDs or roles |
| Overly broad selectors (`.btn`) | Specific selectors (`#login-btn`) |
| Skip `.describe()` | Always add descriptions |
| Create without checking existing | Check page-object-map.md first |

---

## Key Benefits

- **Stability:** Container-first approach with uniqueness verification
- **Maintainability:** Centralized in Page Objects with descriptions
- **Reliability:** MCP visual confirmation prevents wrong targets
- **Consistency:** Priority strategy ensures predictable selection
- **Accessibility:** Role-based locators preferred

---

**📘 See complete walkthrough:** [locator-extraction-example.md](../examples/locator-extraction-example.md)

