# Steps Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW STEPS!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Steps methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing methods instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Steps/methods

---

## Existing Steps Classes

### WikipediaMainSteps (tests/steps/WikipediaMainSteps.ts)
**Fixture:** `wikipediaMainSteps`
**Purpose:** Main page navigation and verification

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| openDirectlyAndVerify() | - | Navigate to main page + verify | ✅ |
| verifyPageOpened() | - | Verify main page loaded | ❌ |

---

### WikipediaLoginSteps (tests/steps/WikipediaLoginSteps.ts)
**Fixture:** `wikipediaLoginSteps`
**Purpose:** Login flow (business logic)

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| verifyPageOpened() | - | Verify login page loaded (incl. title) | ❌ |
| enterCredentials() | username: string, password: string | Enter username + password | ✅ |
| clickLoginButton() | - | Click login button | ❌ |
| login() | username: string, password: string | Full login flow | ✅ |

---

## API Steps Classes

### WikipediaAuthApiSteps (tests/api-steps/WikipediaAuthApiSteps.ts)
**Fixture:** `wikipediaAuthApiSteps`
**Purpose:** Authentication operations for API requests

| Method | Parameters | Returns | Description | Composite? |
|--------|------------|---------|-------------|------------|
| getAccessToken() | - | Promise<string> | Get OAuth access token | ❌ |
| getCsrfToken() | accessToken: string | Promise<string> | Get CSRF token for edit operations | ❌ |
| getAuthTokens() | - | Promise<{accessToken: string, csrfToken: string}> | Get both access and CSRF tokens | ✅ |

---

## Common Patterns

### Authentication Flow (Mixed PO + Steps)
```typescript
// Steps for business action (navigate + verify)
await wikipediaMainSteps.openDirectlyAndVerify();

// PO for atomic click
await wikipediaNavigationMenu.clickLogIn();

// Steps for business action (enter credentials + click login)
await wikipediaLoginSteps.login(username, password);

// PO for atomic verification
await wikipediaMainPage.verifyPageOpened();
```

### Navigate to Main Page
```typescript
await wikipediaMainSteps.openDirectlyAndVerify();
```

### API Authentication Flow
```typescript
// Get authentication tokens for API operations
const { accessToken, csrfToken } = await wikipediaAuthApiSteps.getAuthTokens();

// Use tokens in API calls
await mediaWikiPageService.createPage(title, content, csrfToken, accessToken, summary);
```

---

## Update History

| Date | Steps Class | Changes |
|------|-------------|---------|
| 2025-12-22 | WikipediaAuthApiSteps | Created API Steps for authentication operations | System |
| 2025-01-XX | All | Updated map to reflect current implementation | System |
| 2025-12-15 | WikipediaMainSteps | Documented openDirectlyAndVerify() | System |
| 2025-12-15 | WikipediaLoginSteps | Enhanced verifyPageOpened() with URL/title assertions | System |
| 2025-12-03 | All | Initial creation | System |
