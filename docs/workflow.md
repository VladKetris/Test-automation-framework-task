# Spec-Driven Workflow

⚠️ **NO COPY-PASTE POLICY**:
- This document describes the **process**, not code to copy
- Any code snippets are **illustrative only**
- Create your own implementations based on YOUR application's requirements

Build robust tests without duplication. Spec files are input - all implementation follows from test scenarios.

---

## Core Steps

### 1. Spec Definition (AI Input)
- **Format**: Gherkin (Given/When/Then)
- **Purpose**: Use as a prompt for the AI Agent
- **Storage**: Ephemeral / Reference only. Do NOT commit `.feature` files to the repository
- **Process**: Paste the Gherkin scenario into the chat with the AI

### 2. Locator Strategy (Reuse First)

**Before writing any code:**

1. **SEARCH EXISTING**: Check `docs/maps/page-object-map.md` and search the codebase
   - If the Page Object and locator already exist → **use them**
   - If the Page Object exists but a method is missing → **extend the existing Page Object**

2. **NEW LOCATORS**: Follow [locators.md](patterns/locators.md) methodology
   - Use MCP for visual analysis
   - Verify uniqueness before implementation
   - Always add `.describe()` to locators

3. Prefer using existing locators and methods from existing Page Objects

### 3. 🔴 MANDATORY: Check Maps Before Coding

**STOP! Before writing ANY code:**
1. **OPEN** `docs/maps/page-object-map.md` - Check existing Page Objects
2. **OPEN** `docs/maps/steps-map.md` - Check existing Steps classes
3. **SEARCH** for existing methods (even with different names)
4. **VERIFY** no similar functionality exists
5. **UPDATE** both maps after creating/editing code

### 4. Implementation

**Reference:** `.cursorrules` is the authoritative source for all coding rules and structure.

**Documentation:**
| Pattern | Document |
|---------|----------|
| Page Objects | [patterns/page-object.md](patterns/page-object.md) |
| Steps | [patterns/step-definition.md](patterns/step-definition.md) |
| Locators | [patterns/locators.md](patterns/locators.md) |
| API utilities | [patterns/api-utils.md](patterns/api-utils.md) |
| Test data | [patterns/test-data-management.md](patterns/test-data-management.md) |
| Elements | [patterns/elements.md](patterns/elements.md) |
| Special cases | [examples/special-cases.md](examples/special-cases.md) |
| Coding standards | [coding-standards.md](coding-standards.md) |

### 5. Tests (thin orchestration)

Tests can use **both** Page Objects and Steps:
- **Steps** for business-meaningful actions (login, checkout, search)
- **Page Objects** for simple, single atomic actions (click, fill, verify element)

Choose based on intent, not line count. Keep test-specific constants inside the test body.

**Preconditions (Shared Setup)**
- Use `test.beforeEach(...)` for **common preconditions** shared by all tests in a `test.describe(...)` block
- `beforeEach` can use both Steps and Page Objects (same flexibility as tests)
- Keep test-specific data/constants **inside the test** unless it truly applies to every test
- Prefer **API Steps** for setup/teardown when possible (faster and more reliable than UI)

**Global Preconditions (Tag-based)**
- Use test tags for **global preconditions** that apply across multiple test files
- Tag `@ui_auth` automatically authenticates the user before the test runs
- Global hooks are defined in `tests/fixtures/global-hooks.fixture.ts`
- Tests with `{ tag: ['@ui_auth'] }` will automatically run authentication before test execution
- Example: `test('My test', { tag: ['@ui_auth'] }, async ({ ... }) => { ... });`

**Assertions (URL)**
- 🔴 **Never assert URLs** in tests/steps/page objects. Use page-level UI signals (heading/content/title) instead.

### 6. Validation (runbook)

```bash
pnpm typecheck       # TypeScript type checking
pnpm lint            # ESLint code quality
pnpm test            # Run tests
pnpm exec playwright show-report
```

**Quick validation before commit:**
```bash
pnpm typecheck && pnpm lint && pnpm test
```

### 7. Code Submission

1. **Create feature branch** from current branch
2. **Verify all tests pass** (100% required)
3. **Stage changes** (git add) - **Only `.ts` files (tests, pages, steps)**. Do NOT add `.feature` files.
4. **Create commit** with descriptive message
5. **Push branch** to remote
6. **Create Pull Request**
7. **Result**: Open PR (NOT merged!)

### 8. API Steps (When Needed)

Use API Steps for test data setup/teardown (faster than UI interactions).

- **Location**: `tests/api-steps/`
- **Pattern**: Same as UI Steps (use `@step` decorator on ALL methods)
- **Fixture**: Import from `tests/fixtures/api.fixture.ts`

**Components**:
| File | Purpose |
|------|---------|
| `utils/api-client.ts` | Generic HTTP wrapper (GET/POST/PUT/DELETE) |
| `tests/api-steps/*ApiSteps.ts` | Domain-specific API methods |

**Example API Steps:**
```typescript
import { step } from '@utils/decorators';
import { ApiClient } from '@utils/api-client';

export class UserApiSteps {
    constructor(private readonly apiClient: ApiClient) {}

    /**
     * Create user via API
     */
    @step('Create user via API: {0}')
    async createUser(name: string, email: string): Promise<User> {
        const response = await this.apiClient.post('/users', { 
            data: { name, email } 
        });
        return response.json();
    }

    /**
     * Delete user via API
     */
    @step('Delete user via API: {0}')
    async deleteUser(userId: string): Promise<void> {
        await this.apiClient.delete(`/users/${userId}`);
    }
}
```

**Usage Pattern (API + UI mixed):**
```typescript
import { test } from '@fixtures';

test('Edit user profile', async ({ userApiSteps, profilePage }) => {
    const user = await userApiSteps.createUser('John', 'john@test.com');
    await profilePage.navigate(user.id);
    await profilePage.verifyUserName('John');
    await userApiSteps.deleteUser(user.id);
});
```

**See [patterns/api-utils.md](patterns/api-utils.md) for complete API patterns.**

---

## Directory Structure

```
tests/
├── api/                 ← API Layer
│   ├── builders/        ← Request Builders
│   ├── constants/       ← StatusCode, Headers, ContentType
│   ├── routes/          ← Endpoint definitions
│   ├── schemas/         ← Zod Schemas
│   └── services/        ← API Services
├── pages/               ← Page Objects (reuse first!)
├── steps/               ← UI Steps Classes (@step decorators)
├── api-steps/           ← API Steps Classes (@step decorators)
├── fixtures/            ← Test Fixtures (steps.fixture.ts, api.fixture.ts)
├── data/                ← Test data (environment/, wikipedia/)
└── specs/               ← Spec files (Test Scenarios)

utils/
├── api-client.ts        ← HTTP wrapper
├── config.ts            ← Environment configuration
├── decorators.ts        ← @step decorator
├── secrets.ts           ← Credentials from env vars
├── test-data-generator.ts ← Random data (Faker.js)
├── test-data-provider.ts  ← Static data from JSON
└── ...
```

---

## Success Criteria

- ✅ Tests execute 100% successfully
- ✅ TypeScript compiles without errors (`pnpm typecheck`)
- ✅ ESLint passes without errors (`pnpm lint`)
- ✅ Maps updated after creating code
- ✅ All coding rules followed (see `.cursorrules` and `docs/coding-standards.md`)

**For complete rules and anti-patterns, see `.cursorrules` and `docs/coding-standards.md`.**
