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

### WikipediaSearchSteps (tests/steps/WikipediaSearchSteps.ts)
**Fixture:** `wikipediaSearchSteps`
**Purpose:** Search functionality

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| searchForArticle() | articleTitle: string | Search for article from navigation menu | ✅ |
| verifyArticlePageDisplayed() | articleTitle: string | Verify article page with title is displayed | ✅ |

---

### WikipediaAuthSteps (tests/steps/WikipediaAuthSteps.ts)
**Fixture:** `wikipediaAuthSteps`
**Purpose:** User authentication via UI login flow

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| authenticateUser() | username: string, password: string | Authenticate user via UI login flow (open main page, click login, enter credentials, login) | ✅ |

**Usage:**
```typescript
const { username, password } = getWikipediaCredentials();
await wikipediaAuthSteps.authenticateUser(username, password);
```

**Note:** Credentials must be passed as parameters (never read internally). Tests get credentials from `getWikipediaCredentials()` in `@utils/secrets`.

---

### WikipediaArticleCreateSteps (tests/steps/WikipediaArticleCreateSteps.ts)
**Fixture:** `wikipediaArticleCreateSteps`
**Purpose:** Article creation workflow

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| navigateToCreateNewPage() | - | Navigate to create new page (open main menu, click create new page in sidebar) | ✅ |
| createNewPageWithTitle() | pageTitle: string | Create new page with title (verify page opened, enter title, click create) | ✅ |

---

### WikipediaArticleEditSteps (tests/steps/WikipediaArticleEditSteps.ts)
**Fixture:** `wikipediaArticleEditSteps`
**Purpose:** Article editing workflow

| Method | Parameters | Description | Composite? |
|--------|------------|-------------|------------|
| editContentAndPublish() | newContent: string | Edit article content and publish (verify editor opened, delete/enter content, click publish) | ✅ |
| saveChangesWithSummary() | editSummary: string | Save changes with edit summary (verify dialog opened, enter summary, click publish) | ✅ |

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
import { getWikipediaCredentials } from '@utils/secrets';

// Get credentials at test level (never in Steps)
const { username, password } = getWikipediaCredentials();

// Steps for business action (navigate + verify)
await wikipediaMainSteps.openDirectlyAndVerify();

// PO for atomic click
await wikipediaNavigationMenu.clickLogIn();

// Steps for business action (enter credentials + click login)
await wikipediaLoginSteps.login(username, password);

// PO for atomic verification
await wikipediaMainPage.verifyPageOpened();
```

### Composite Authentication (Single Step)
```typescript
const { username, password } = getWikipediaCredentials();
await wikipediaAuthSteps.authenticateUser(username, password);
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

### Authentication in Tests
```typescript
import { getWikipediaCredentials } from '@utils/secrets';

test('Edit article', async ({
    wikipediaAuthSteps,
    wikipediaArticlePage,
    wikipediaArticleEditSteps
}) => {
    // Read credentials at test level
    const { username, password } = getWikipediaCredentials();
    
    // Pass to Steps as parameters
    await wikipediaAuthSteps.authenticateUser(username, password);
    
    // Continue with authenticated actions
    await wikipediaArticlePage.clickEdit();
    await wikipediaArticleEditSteps.editContentAndPublish('New content');
});
```

---

## Update History

| Date | Steps Class | Changes |
|------|-------------|---------|
| 2025-12-22 | WikipediaAuthSteps | Updated to accept credentials as parameters | System |
| 2025-12-22 | WikipediaAuthApiSteps | Created API Steps for authentication operations | System |
| 2025-01-XX | WikipediaSearchSteps | Created new Steps class for search functionality | System |
| 2025-01-XX | WikipediaArticleCreateSteps | Created composite method for creating new page with title | System |
| 2025-01-XX | WikipediaArticleEditSteps | Created composite method for editing article content and publishing | System |
| 2025-12-15 | WikipediaMainSteps | Documented openDirectlyAndVerify() | System |
| 2025-12-15 | WikipediaLoginSteps | Enhanced verifyPageOpened() with URL/title assertions | System |
| 2025-12-03 | All | Initial creation | System |
