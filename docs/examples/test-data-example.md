# Test Data Example

Complete examples for test data management following [test-data-management pattern](../patterns/test-data-management.md).

**📘 Related:** [test-data-management.md](../patterns/test-data-management.md) | [complete-test-example.md](complete-test-example.md)

---

## Utils Structure

```
utils/
├── config.ts              → Environment config (URLs, timeouts)
├── secrets.ts             → Credentials from env vars
├── test-data-generator.ts → Random data generation (Faker.js)
├── test-data-provider.ts  → Static test data from JSON
├── array-utils.ts         → Random selection utilities
└── json-loader.ts         → JSON file loading
```

---

## When to Use Random vs Static Data

| Use Case | Data Type | Example |
|----------|-----------|---------|
| Non-existent entities | **Random** | `randomUsername()` for 404 tests |
| Unique identifiers | **Random** | `randomEmail()` for new account |
| Form field values | **Random** | `randomPassword()` for registration |
| Valid entities | **Static** | `getRandomArticle()` for existing page |
| Credentials | **Secrets** | `getWikipediaCredentials()` |
| URLs, timeouts | **Config** | `getEnvironment()` |

---

## Random Data Generation

```typescript
import {
    generateUser,
    randomUsername,
    randomEmail,
    randomPassword,
    randomString,
    randomNumber,
    createArticleTitle,
    randomSentence,
    randomParagraph
} from '@utils/test-data-generator';

// Complete user profile
const user = generateUser();
// { firstName, lastName, fullName, email, phone, address }

// Account credentials
const username = randomUsername();        // "John_Doe123"
const password = randomPassword();        // Default 12 chars
const password16 = randomPassword(16);    // Custom length

// Contact info
const email = randomEmail();              // "john.doe@example.com"

// Text content
const text = randomString();              // Default 10 chars
const text20 = randomString(20);          // Custom length
const sentence = randomSentence();        // "Lorem ipsum dolor sit."
const paragraph = randomParagraph();      // Full paragraph

// Numbers
const num = randomNumber();               // 0-1000
const numRange = randomNumber(1, 100);    // Custom range

// Wikipedia-safe article title
const { pageTitle, headerTitle } = createArticleTitle('AutoTest');
// pageTitle: "AutoTest_abc123" (for URLs)
// headerTitle: "AutoTest abc123" (for UI display)
```

### All Available Generators

| Category | Functions |
|----------|-----------|
| **User** | `generateUser()`, `generateAddress()` |
| **Names** | `randomFirstName()`, `randomLastName()`, `randomFullName()` |
| **Contact** | `randomEmail()`, `randomMobileNumber()`, `randomPhoneNumber()` |
| **Account** | `randomUsername()`, `randomPassword(length?)` |
| **Text** | `randomString(length?)`, `randomSentence()`, `randomParagraph()`, `createArticleTitle()` |
| **Numbers** | `randomNumber(min?, max?)`, `randomDecimal(min?, max?, precision?)` |
| **Dates** | `randomPastDate()`, `randomFutureDate()`, `randomBirthdate()` |
| **Internet** | `randomUrl()`, `randomCompanyName()` |

---

## Static Data from Provider

```typescript
import { getRandomArticle, getAllArticles } from '@utils/test-data-provider';

// Get random article from valid list
const article = getRandomArticle();  // "Earth", "Python", etc.

// Get all articles
const articles = getAllArticles();   // ["Earth", "Python", "London", ...]
```

### Data Provider Pattern

```typescript
// utils/test-data-provider.ts
import { loadJson, JSON_PATHS } from './json-loader';
import { getRandomItem } from './array-utils';

export function getRandomArticle(): string {
    return getRandomItem(getAllArticles());
}

export function getAllArticles(): string[] {
    const data = loadJson(JSON_PATHS.WIKIPEDIA_ARTICLES);
    return data.articles as string[];
}
```

### JSON Test Data

```json
// tests/data/wikipedia/articles.json
{
    "articles": [
        "Earth",
        "Python",
        "London",
        "Computer",
        "Science",
        "History"
    ]
}
```

---

## Environment Config

```typescript
import { getEnvironment } from '@utils/config';

const env = getEnvironment();

// URLs
env.wikipedia.mainPageUrl;  // "https://en.wikipedia.org/wiki/Main_Page"
env.api.apiUrl;             // "https://en.wikipedia.org/w/rest.php"

// Timeouts
env.timeouts.action;        // 5000
env.timeouts.navigation;    // 30000
env.timeouts.assertion;     // 10000
```

---

## Credentials from Secrets

```typescript
import { getWikipediaCredentials, getMetaApiCredentials } from '@utils/secrets';

// UI login credentials
const { username, password } = getWikipediaCredentials();

// API OAuth credentials
const { clientId, clientSecret } = getMetaApiCredentials();
```

---

## Complete Test Examples

### UI Test with Random Data

```typescript
import { test } from '@fixtures';
import { randomUsername, randomPassword, randomEmail } from '@utils/test-data-generator';

test.describe('Wikipedia Account Creation', () => {
    test('Create account with random credentials', async ({
        wikipediaMainPage,
        wikipediaNavigationMenu,
        wikipediaCreateAccountPage
    }) => {
        const username = randomUsername();
        const password = randomPassword();
        const email = randomEmail();

        await wikipediaMainPage.navigate();
        await wikipediaNavigationMenu.clickCreateAccount();
        await wikipediaCreateAccountPage.enterUsername(username);
        await wikipediaCreateAccountPage.enterPassword(password);
        await wikipediaCreateAccountPage.enterEmail(email);
        await wikipediaCreateAccountPage.clickCreateAccount();
    });
});
```

### UI Test with Static Data

```typescript
import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';
import { getRandomArticle } from '@utils/test-data-provider';

test.describe('Wikipedia Login and Search', () => {
    test('Login and view existing article', async ({
        wikipediaMainPage,
        wikipediaLoginSteps,
        wikipediaNavigationMenu
    }) => {
        const articleTitle = getRandomArticle();

        await wikipediaMainPage.navigate();
        await wikipediaLoginSteps.navigateToLogin();
        await wikipediaLoginSteps.login(getWikipediaCredentials());
        await wikipediaNavigationMenu.enterSearchText(articleTitle);
        await wikipediaNavigationMenu.clickSearch();
    });
});
```

### API Test with Random Data

```typescript
import { test, expect } from '@fixtures';
import { randomString } from '@utils/test-data-generator';
import { assertSchema } from '@utils/parse-response';
import { ErrorResponseSchema, StatusCode } from '@api';

test.describe('Wikipedia API Error Handling', () => {
    test('Get non-existent page returns 404', async ({ pageService }) => {
        const nonExistentPage = `NonExistent_${randomString()}`;
        
        const response = await pageService.getPageContent(nonExistentPage);
        
        await expect(response).toHaveStatusCode(StatusCode.NOT_FOUND);
        await assertSchema(response, ErrorResponseSchema, 'Error Response');
    });
});
```

### API Test with Static Data

```typescript
import { test, expect } from '@fixtures';
import { getRandomArticle } from '@utils/test-data-provider';
import { assertSchema } from '@utils/parse-response';
import { PageContentSchema, StatusCode } from '@api';

test.describe('Wikipedia API Page Content', () => {
    test('Get existing page returns valid content', async ({ pageService }) => {
        const existingPage = getRandomArticle();
        
        const response = await pageService.getPageContent(existingPage);
        
        await expect(response).toHaveStatusCode(StatusCode.OK);
        const data = await assertSchema(response, PageContentSchema, 'Page Content');
        expect(data.title).toBe(existingPage);
    });
});
```

---

## Test Constants Pattern

Define test-specific constants inside test functions:

```typescript
import { test, expect } from '@fixtures';
import { randomString } from '@utils/test-data-generator';

test.describe('Wikipedia Search', () => {
    test('Search with minimum characters shows results', async ({
        wikipediaMainPage,
        wikipediaNavigationMenu
    }) => {
        const MIN_SEARCH_LENGTH = 3;
        const searchTerm = randomString(MIN_SEARCH_LENGTH);

        await wikipediaMainPage.navigate();
        await wikipediaNavigationMenu.enterSearchText(searchTerm);
        await wikipediaNavigationMenu.clickSearch();
    });
});
```

---

## Environment Setup

### Local Development (.env)

```env
ENV=dev
WIKI_USERNAME=your_username
WIKI_PASSWORD=your_password
WIKI_META_CLIENT_ID=your_client_id
WIKI_META_CLIENT_SECRET=your_client_secret
```

### CI/CD (GitHub Actions)

```yaml
env:
  ENV: prod
  WIKI_USERNAME: ${{ secrets.WIKI_USERNAME }}
  WIKI_PASSWORD: ${{ secrets.WIKI_PASSWORD }}
  WIKI_META_CLIENT_ID: ${{ secrets.WIKI_META_CLIENT_ID }}
  WIKI_META_CLIENT_SECRET: ${{ secrets.WIKI_META_CLIENT_SECRET }}
```

### CI/CD (Jenkins)

```groovy
withCredentials([
    usernamePassword(
        credentialsId: 'wikipedia-credentials',
        usernameVariable: 'WIKI_USERNAME',
        passwordVariable: 'WIKI_PASSWORD'
    ),
    string(credentialsId: 'wiki-client-id', variable: 'WIKI_META_CLIENT_ID'),
    string(credentialsId: 'wiki-client-secret', variable: 'WIKI_META_CLIENT_SECRET')
]) {
    sh 'pnpm test'
}
```

---

## Best Practices Summary

| Practice | Description |
|----------|-------------|
| **Random for unique** | Use generators for unique/non-existent data |
| **Static for valid** | Use providers for entities that must exist |
| **Secrets for credentials** | Never hardcode passwords |
| **Config for URLs** | Use environment config for endpoints |
| **Constants in tests** | Define magic numbers as named constants |
| **Validate JSON data** | Ensure all static data exists in target system |

---

**📘 See also:**
- [test-data-management.md](../patterns/test-data-management.md) - Full pattern guide
- [complete-test-example.md](complete-test-example.md) - Complete test implementation
