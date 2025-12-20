# Test Data Management

## Utils Architecture

```
utils/
├── api-client.ts        → HTTP client wrapper for API testing
├── array-utils.ts       → Array manipulation utilities
├── config.ts            → Environment config (URLs, timeouts) from JSON
├── decorators.ts        → Step decorator for Playwright reports
├── file-utils.ts        → File system operations (internal)
├── json-loader.ts       → JSON file loading (internal)
├── matchers.ts          → Custom Playwright assertions
├── parse-response.ts    → API response parsing with Zod
├── secrets.ts           → Credentials from env vars
├── test-data-generator.ts → Random data generation (Faker.js)
└── test-data-provider.ts  → Static test data from JSON
```

### Responsibility Matrix

| File | Contains | Used By |
|------|----------|---------|
| `api-client.ts` | HTTP methods with base URL | API services |
| `array-utils.ts` | Random item selection, shuffle | TestDataProvider |
| `config.ts` | URLs, timeouts, API endpoints | Page Objects, playwright.config.ts |
| `decorators.ts` | `@step` decorator | Steps classes |
| `file-utils.ts` | Path resolution, file reading | JsonLoader, internal utils |
| `json-loader.ts` | JSON file loading | Config, TestDataProvider |
| `matchers.ts` | Custom expect assertions | API tests |
| `parse-response.ts` | Zod schema validation | API services |
| `secrets.ts` | Env var getters (credentials) | Tests, API builders |
| `test-data-generator.ts` | Random data generation | Tests |
| `test-data-provider.ts` | Static JSON data access | Tests, Steps |

### Utils Documentation Rules

**Rule:** All utility functions in `utils/` must follow these documentation standards:

**✅ DO:**
- Add JSDoc with `@param` and `@returns` tags for each function
- Keep descriptions concise and focused on what the function does
- Document only individual functions, not entire files

**❌ DON'T:**
- Include file-level documentation blocks
- Add section divider comments (`// ====================`)
- Include `@example` blocks or usage examples
- Skip `@param` or `@returns` tags

**Example:**
```typescript
// ✅ GOOD: Function-level JSDoc with @param and @returns
/**
 * Load JSON file from relative path
 * @param relativePath - Relative path to JSON file (without .json extension)
 * @returns Parsed JSON data as record
 */
export function loadJson(relativePath: string): Record<string, unknown> {
    // ...
}

// ❌ BAD: File-level documentation
/**
 * JsonLoader - Functions for loading JSON files
 * 
 * Use this for loading test data from JSON files.
 */
```

---

## Random Data Generation Rule

**Rule:** Use random data generation wherever possible instead of hardcoded values.

### When to Use Random Data

**✅ DO use random data for:**
- Unique identifiers (usernames, emails, page titles)
- Non-existent entities (404 test cases, invalid inputs)
- Test data that should be unique per test run
- Values that don't need to be repeatable across runs
- Temporary test data that will be cleaned up

**✅ DO use static data for:**
- Valid entities that must exist (real article titles, known users)
- Configuration values (URLs, timeouts)
- Test data that needs to be repeatable
- Data used across multiple tests that must match

### Examples

```typescript
// ✅ GOOD: Random data for non-existent page
const NON_EXISTENT_PAGE = `NonExistentPage${randomString()}`;

// ✅ GOOD: Random data for unique test user
const username = randomUsername();
const email = randomEmail();

// ❌ BAD: Hardcoded non-existent page
const NON_EXISTENT_PAGE = 'NonExistentPage12345XYZ';

// ✅ GOOD: Static data for valid article
const PAGE_TITLE = getRandomArticle(); // From valid articles list

// ❌ BAD: Random article title (might not exist)
const PAGE_TITLE = randomString();
```

### Benefits

- **Uniqueness**: Each test run uses different data, reducing conflicts
- **No Magic Values**: Eliminates hardcoded strings/numbers
- **Better Test Isolation**: Tests don't interfere with each other
- **Maintainability**: No need to update hardcoded values

---

## API Client

Thin wrapper around Playwright's `APIRequestContext` with base URL handling.

### Usage

```typescript
import { ApiClient } from '@utils/api-client';

// Create client with base URL
const client = new ApiClient(request, 'https://api.wikipedia.org');

// Make requests
const response = await client.get('/users');
const data = await response.json();

// POST with body
await client.post('/articles', { data: { title: 'Test' } });
```

### Available Methods

| Method | Description |
|--------|-------------|
| `get(url, options?)` | GET request |
| `post(url, options?)` | POST request |
| `put(url, options?)` | PUT request |
| `delete(url, options?)` | DELETE request |
| `patch(url, options?)` | PATCH request |

### Best Practices

#### ✅ DO
- Use in API service classes only
- Let the client handle URL joining (handles slash edge cases)

#### ❌ DON'T
- Use directly in tests — use API services instead
- Manually concatenate base URL with path

---

## Array Utils

Utilities for random selection and array manipulation.

### Usage

```typescript
import { getRandomItem, getRandomItems, shuffleArray } from '@utils/array-utils';

const items = ['apple', 'banana', 'cherry'];

// Get one random item
const fruit = getRandomItem(items);

// Get N random items (no duplicates)
const twoFruits = getRandomItems(items, 2);

// Shuffle array (returns new array)
const shuffled = shuffleArray(items);
```

### Available Functions

| Function | Description |
|----------|-------------|
| `getRandomItem(array)` | Get one random item |
| `getRandomItems(array, count)` | Get N random items without duplicates |
| `shuffleArray(array)` | Return new shuffled array |

### Best Practices

#### ✅ DO
- Use `getRandomItem()` for random test data selection
- Use in TestDataProvider for data access

#### ❌ DON'T
- Use `Math.random()` directly — use these utilities for consistency

---

## Config

Environment configuration loaded from JSON files.

### Usage

```typescript
import { getEnvironment } from '@utils/config';

const env = getEnvironment();

// Access URLs
await page.goto(env.wikipedia.mainPageUrl);

// Access timeouts
const timeout = env.timeouts.action;

// Access API endpoints
const apiUrl = env.api.apiUrl;
```

### Environment Interface

```typescript
interface Environment {
    name: string;
    baseUrl: string;
    api: {
        apiUrl: string;
        metaRestUrl: string;
    };
    wikipedia: {
        landingUrl: string;
        mainPageUrl: string;
    };
    timeouts: {
        navigation: number;
        action: number;
        assertion: number;
        // ... more timeouts
    };
}
```

### Best Practices

#### ✅ DO
- Use in Page Objects for URLs
- Use in playwright.config.ts for timeouts
- Set `ENV` variable to switch environments (`dev`, `prod`)

#### ❌ DON'T
- Use directly in tests — use Page Objects instead
- Hardcode URLs anywhere

---

## Decorators

Step decorator for enhanced Playwright reporting.

### Usage

```typescript
import { step } from '@utils/decorators';

class LoginSteps {
    @step('Enter username')
    async enterUsername(username: string) {
        await this.loginPage.usernameInput.fill(username);
    }

    @step() // Uses method name: "LoginSteps.clickSubmit"
    async clickSubmit() {
        await this.loginPage.submitButton.click();
    }
}
```

### Best Practices

#### ✅ DO
- Use on all public Steps methods
- Provide descriptive step names for reports
- Omit name to use auto-generated `ClassName.methodName`

#### ❌ DON'T
- Use on Page Object methods (steps are for business logic)
- Use on private/helper methods

---

## File Utils

Low-level file system operations.

### Usage

```typescript
import { resolvePath, readFile, fileExists } from '@utils/file-utils';

// Resolve path relative to project root
const configPath = resolvePath('tests/data/config.json');

// Check if file exists
if (fileExists(configPath)) {
    const content = readFile(configPath);
}
```

### Available Functions

| Function | Description |
|----------|-------------|
| `resolvePath(...paths)` | Resolve path relative to project root |
| `readFile(path)` | Read file content as UTF-8 string |
| `fileExists(path)` | Check if file exists |

### Best Practices

#### ✅ DO
- Use in internal utilities (JsonLoader, Config)
- Use `resolvePath()` for cross-platform compatibility

#### ❌ DON'T
- Use `fs` or `path` directly — use file-utils instead
- Use in tests — use higher-level APIs

---

## JSON Loader

Load and parse JSON files from the project.

### Usage

```typescript
import { loadJson, JSON_PATHS } from '@utils/json-loader';

// Use predefined paths
const data = loadJson(JSON_PATHS.WIKIPEDIA_ARTICLES);

// Or custom path (without .json extension)
const config = loadJson('tests/data/custom-config');
```

### Predefined Paths

```typescript
const JSON_PATHS = {
    WIKIPEDIA_ARTICLES: 'tests/data/wikipedia/articles',
} as const;
```

### Best Practices

#### ✅ DO
- Add new paths to `JSON_PATHS` constant
- Use in TestDataProvider for data access

#### ❌ DON'T
- Use directly in tests — use TestDataProvider instead
- Include `.json` extension in path

---

## Matchers

Custom Playwright assertions for API testing.

### Usage

```typescript
import { expect } from '@playwright/test';
import { matchers } from '@utils/matchers';

// Extend expect with custom matchers
expect.extend(matchers);

// Use in tests
const response = await client.get('/users');
await expect(response).toHaveStatusCode(200);
```

### Available Matchers

| Matcher | Description |
|---------|-------------|
| `toHaveStatusCode(code)` | Assert response status code |

### Best Practices

#### ✅ DO
- Extend expect once in fixtures
- Use for cleaner API assertions

#### ❌ DON'T
- Extend expect multiple times
- Use `response.status() === 200` when matcher is available

---

## Parse Response

API response parsing and validation with Zod schemas.

### Usage

```typescript
import { parseResponse, safeParseResponse, assertSchema } from '@utils/parse-response';
import { z } from 'zod';

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
});

// Parse and validate (throws on error)
const user = await parseResponse(response, UserSchema);

// Safe parse (returns result object)
const result = await safeParseResponse(response, UserSchema);
if (result.success) {
    console.log(result.data);
}

// Assert schema in tests (fails test on error)
const data = await assertSchema(response, UserSchema, 'User Response');
```

### Available Functions

| Function | Description |
|----------|-------------|
| `parseResponse(response, schema)` | Parse and validate, throws on error |
| `safeParseResponse(response, schema)` | Safe parse, returns `{ success, data/error }` |
| `assertSchema(response, schema, name?)` | Parse with test assertion |

### Best Practices

#### ✅ DO
- Define Zod schemas in `tests/api/schemas/`
- Use `assertSchema()` in tests for clear error messages
- Use `parseResponse()` in API services

#### ❌ DON'T
- Skip schema validation for API responses
- Use `response.json()` directly when schema exists

---

## Secrets

Credentials and sensitive data from environment variables.

### Usage

```typescript
import { getWikipediaCredentials, getMetaApiCredentials } from '@utils/secrets';

// In tests
const { username, password } = getWikipediaCredentials();

// In API builders (OAuth)
const { clientId, clientSecret } = getMetaApiCredentials();
```

### Available Functions

| Function | Returns |
|----------|---------|
| `getWikipediaCredentials()` | `{ username, password }` |
| `getMetaApiCredentials()` | `{ clientId, clientSecret }` |

### Environment Variables

```env
WIKI_USERNAME=your_username
WIKI_PASSWORD=your_password
WIKI_META_CLIENT_ID=your_client_id
WIKI_META_CLIENT_SECRET=your_client_secret
```

### Best Practices

#### ✅ DO
- Use in tests and API builders only
- Add required vars to `.env.example`
- Pass credentials as parameters to Steps

#### ❌ DON'T
- Use inside Steps or Page Objects
- Commit actual credentials
- Access `process.env` directly

---

## Test Data Generator

Random data generation using Faker.js.

### Usage

```typescript
import {
    generateUser,
    randomUsername,
    randomEmail,
    randomPassword,
    randomString,
    randomNumber,
    createArticleTitle
} from '@utils/test-data-generator';

// Generate complete user profile
const user = generateUser();

// Generate primitives
const username = randomUsername();
const email = randomEmail();
const password = randomPassword(16);
const text = randomString(10);
const num = randomNumber(1, 100);

// Wikipedia-safe article title
const { pageTitle, headerTitle } = createArticleTitle('AutoTest');
// pageTitle: "AutoTest_abc123" (for URLs)
// headerTitle: "AutoTest abc123" (for UI)
```

### Available Functions

| Category | Functions |
|----------|-----------|
| User | `generateUser()`, `generateAddress()` |
| Names | `randomFirstName()`, `randomLastName()`, `randomFullName()` |
| Contact | `randomEmail()`, `randomMobileNumber()`, `randomPhoneNumber()` |
| Account | `randomUsername()`, `randomPassword(length?)` |
| Text | `randomString(length?)`, `randomSentence()`, `randomParagraph()`, `createArticleTitle()` |
| Numbers | `randomNumber(min?, max?)`, `randomDecimal(min?, max?, precision?)` |
| Dates | `randomPastDate()`, `randomFutureDate()`, `randomBirthdate()` |
| Internet | `randomUrl()`, `randomCompanyName()` |

### Best Practices

#### ✅ DO
- Use for unique test data on each run
- Use for form field generation
- Use `createArticleTitle()` for Wikipedia page titles

#### ❌ DON'T
- Use for static/repeatable test data — use TestDataProvider
- Use `Math.random()` or manual string generation

---

## Test Data Provider

Static test data access from JSON files.

### Usage

```typescript
import { getRandomArticle, getAllArticles } from '@utils/test-data-provider';

// Get random article for testing
const article = getRandomArticle();

// Get all articles
const articles = getAllArticles();
```

### Available Functions

| Function | Description |
|----------|-------------|
| `getRandomArticle()` | Get random Wikipedia article title |
| `getAllArticles()` | Get all article titles |

### Best Practices

#### ✅ DO
- Use for repeatable test data sets
- Add new data getters when adding JSON files
- Reuse `getAll*()` functions internally in `getRandom*()` functions
- Validate all test data exists in target system before committing

#### ❌ DON'T
- Access JSON files directly in tests
- Mix with random data when consistency is needed
- Include invalid or non-existent data in JSON files
- Duplicate logic between `getRandom*()` and `getAll*()` functions

**Example:**
```typescript
// ✅ GOOD: Reuse getAllArticles() internally
export function getRandomArticle(): string {
    return getRandomItem(getAllArticles());
}

export function getAllArticles(): string[] {
    const data = loadJson(JSON_PATHS.WIKIPEDIA_ARTICLES);
    return data.articles as string[];
}

// ❌ BAD: Duplicate logic
export function getRandomArticle(): string {
    const data = loadJson(JSON_PATHS.WIKIPEDIA_ARTICLES); // Duplicated!
    return getRandomItem(data.articles);
}
```

### JSON Test Data Validation Rules

**✅ DO:**
- Store static, repeatable data in JSON files
- Use valid, existing data (verify against actual API/resources)
- Keep data organized by domain (`tests/data/wikipedia/`, `tests/data/users/`)
- Validate data exists before using in tests
- Use descriptive file names

**❌ DON'T:**
- Include invalid or non-existent data
- Hardcode test data in test files
- Use special page paths or invalid formats
- Mix random and static data

**Example:**
```json
// ✅ GOOD: Valid Wikipedia articles
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

// ❌ BAD: Invalid articles
{
    "articles": [
        "Page125",                    // Doesn't exist
        "Hyundai Global 900/edithistory", // Invalid special page
        "NonExistentArticle123"       // Doesn't exist
    ]
}
```

**Data Validation Checklist:**
Before committing test data:
- [ ] All entries exist in the target system/API
- [ ] No special page paths or invalid formats
- [ ] Data is appropriate for the test scenario
- [ ] JSON syntax is valid
- [ ] Data provider functions work correctly

---

## Environment Setup

### Local Development (.env file)

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
```

### Running Tests

```bash
# Default (dev)
pnpm test

# Explicit environment
ENV=prod pnpm test
```
