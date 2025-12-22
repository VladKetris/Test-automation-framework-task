# Locator Extraction Methodology

Universal process for creating stable, maintainable UI locators using Playwright MCP.

**📘 Full Example:** [locator-extraction-example.md](../examples/locator-extraction-example.md)

---

## 🔴 MANDATORY PROCESS - NO EXCEPTIONS

**This process is MANDATORY. Never create locators without completing ALL 6 steps.**

### Quick Verification Checklist (Before Writing Code)

Before implementing ANY new locator, you MUST:

- [ ] **Step 1:** Checked [page-object-map.md](../maps/page-object-map.md) and existing Page Objects
- [ ] **Step 2:** Used `mcp_playwright_browser_navigate` to navigate to target page
- [ ] **Step 3:** Used `mcp_playwright_browser_snapshot` to see page structure
- [ ] **Step 4:** Used `mcp_playwright_browser_evaluate` to extract HTML and verify uniqueness
- [ ] **Step 5:** Verified locator returns exactly 1 element (not 0, not 2+)
- [ ] **Step 6:** Documented verification results before implementation

**❌ If ANY checkbox is unchecked, DO NOT proceed with implementation**

---

---

## Process: 6 Steps (ALL MANDATORY)

### 1. Check Existing Locators 🚨 MANDATORY - DO NOT SKIP

**Before creating ANY new locator, you MUST:**

1. **Open** [page-object-map.md](../maps/page-object-map.md)
2. **Search** existing Page Objects for similar elements using:
   ```bash
   grep -r "locator\|getByRole" tests/pages/
   ```
3. **Read** existing Page Object files to understand locator patterns
4. **Reuse** existing locators when possible

**Decision Tree:**
- ✅ **Locator exists** → Use it, don't create new
- ✅ **Similar exists** → Extend existing Page Object
- ✅ **None exists** → Continue to Step 2 (MCP verification required)

**❌ NEVER proceed to Step 2 without completing Step 1**

---

### 2. MCP Visual Analysis 🚨 MANDATORY - VERIFICATION REQUIRED

**🔴 YOU MUST USE MCP BROWSER TOOLS - NO EXCEPTIONS**

**Required Actions (in order):**

1. **Navigate to target page** using MCP:
   ```
   mcp_playwright_browser_navigate → url: "{target_page_url}"
   ```

2. **Take page snapshot** for visual confirmation:
   ```
   mcp_playwright_browser_snapshot
   ```

3. **Identify target element** in the snapshot
4. **Identify container/parent structure**
5. **Confirm element state** (visible, clickable, enabled)

**Visual Confirmation Checklist (MUST complete all):**
- [ ] Element location identified in snapshot
- [ ] Container/parent structure understood
- [ ] Element state confirmed (visible, clickable, enabled)
- [ ] Similar elements nearby identified (for uniqueness verification)

**❌ NEVER skip MCP verification - Assumptions are NOT allowed**

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

### 5. Validation 🚨 MANDATORY - UNIQUENESS VERIFICATION REQUIRED

**🔴 YOU MUST VERIFY UNIQUENESS VIA MCP - NO EXCEPTIONS**

**Browser-Based Uniqueness Check (MANDATORY):**

```javascript
// Run via mcp_playwright_browser_evaluate
// MUST verify each locator option returns exactly 1 element
document.querySelectorAll('#wpName1').length  // Must return: 1
document.querySelectorAll('input[name="wpName"]').length  // Must return: 1
document.querySelectorAll('.mw-input').length  // Returns 3 → ❌ REJECT
```

**Verification Table (MUST document results):**

| Locator | Page State | Match Count | Result | Action |
|---------|------------|:-----------:|:------:|--------|
| `#wpName1` | Login Page | 1 | ✅ | **SELECT** |
| `input[name="wpName"]` | Login Page | 1 | ✅ | Backup option |
| `.mw-input` | Login Page | 3 | ❌ | **REJECT** |

**Stability Testing Checklist (MUST verify):**
- [ ] Same locator after page reload (verify via MCP)

**🔴 SPECIAL REQUIREMENT: formLocator Uniqueness (MANDATORY for Page Objects)**

For `formLocator` (passed to `BasePage` constructor), you **MUST verify uniqueness across different page types**:

1. **Navigate to target page** → Verify locator exists (exactly 1 element)
2. **Navigate to similar/related pages** → Verify locator does NOT exist (0 elements)
3. **Prefer simple, semantic locators** over complex structural selectors

**Example Verification Process:**
```javascript
// Step 1: Navigate to article page
mcp_playwright_browser_navigate → url: "https://test.wikipedia.org/wiki/Test"
mcp_playwright_browser_evaluate → function: "document.querySelectorAll('a[href*=\"action=edit\"]').length"
// Result: 1 ✅ (Edit link exists on article page)

// Step 2: Navigate to Main Page
mcp_playwright_browser_navigate → url: "https://test.wikipedia.org/wiki/Main_Page"
mcp_playwright_browser_evaluate → function: "document.querySelectorAll('a[href*=\"action=edit\"]').length"
// Result: 0 ✅ (Edit link does NOT exist on Main Page - it has "View source" instead)

// ✅ VERIFIED: formLocator is unique to article pages
```

**Good Examples:**
- ✅ `page.getByRole('link', { name: 'Edit' })` - Simple, semantic, unique
- ✅ `page.locator('#unique-page-container')` - Unique ID that doesn't exist on other pages

**Bad Examples:**
- ❌ `page.locator('#bodyContent')` - Exists on multiple page types
- ❌ `page.locator('#mw-content-text')` - Exists on both article pages and Main Page
- ❌ Complex structural selectors that depend on DOM hierarchy
- [ ] Same across different page states (logged in/out, etc.)
- [ ] Independent of dynamic content
- [ ] Works across viewport sizes (if applicable)

**❌ NEVER implement locator without uniqueness verification**

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
| **Create locators without MCP verification** | **ALWAYS use MCP browser tools first** |
| **Assume locator structure** | **Verify via `mcp_playwright_browser_evaluate`** |
| Multiple locators for same element | ONE verified locator |
| Skip uniqueness validation | Always verify count = 1 via MCP |
| Use dynamic/auto-generated IDs | Use stable IDs or roles (verify first) |
| Overly broad selectors (`.btn`) | Specific selectors (`#login-btn`) |
| Skip `.describe()` | Always add descriptions |
| Create without checking existing | Check page-object-map.md first |
| Guess based on common patterns | Navigate to page and verify structure |

---

## Key Benefits

- **Stability:** Container-first approach with uniqueness verification
- **Maintainability:** Centralized in Page Objects with descriptions
- **Reliability:** MCP visual confirmation prevents wrong targets
- **Consistency:** Priority strategy ensures predictable selection
- **Accessibility:** Role-based locators preferred

---

**📘 See complete walkthrough:** [locator-extraction-example.md](../examples/locator-extraction-example.md)

