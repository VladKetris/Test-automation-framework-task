# Tech Stack

## Core Technologies
- **TypeScript 5.0+** - Implementation language
- **Playwright** - Browser automation with auto-waiting
- **Playwright Test Runner** - Native test runner
- **Playwright HTML Reporter** - Built-in reporting
- **Zod** - Runtime schema validation for API responses
- **ESLint 9** - Code quality and linting with TypeScript and Playwright plugins
- **Path Aliases** - TypeScript path mapping for clean imports (`@pages`, `@steps`, `@api`, `@fixtures`, `@utils`, `@data`)

## Framework Components
- **Page Object Model** - UI abstraction pattern (see `tests/pages/`)
- **Steps Classes** - Business logic layer (see `tests/steps/`)
- **API Layer** - API services, routes, schemas (see `tests/api/`)
- **Fixtures** - Dependency injection for tests (see `tests/fixtures/`)
- **BasePage Check Methods** - Centralized element state validation
- **Locator Extraction** - MCP-based locator methodology (see [patterns/locators.md](patterns/locators.md))
- **HTML Reports** - Comprehensive reporting with screenshots, traces, and videos

## Code Quality Tools

### ESLint Configuration

The framework uses ESLint 9 with flat config for code quality enforcement.

**Plugins:**
- `@typescript-eslint` - TypeScript-specific rules
- `eslint-plugin-playwright` - Playwright best practices

**Key Rules:**
| Rule | Description |
|------|-------------|
| `no-unused-vars` | Detect unused variables/imports |
| `no-floating-promises` | Require awaiting promises |
| `no-wait-for-timeout` | Prevent `page.waitForTimeout()` |
| `no-page-pause` | Prevent `page.pause()` in code |

**Commands:**
```bash
pnpm lint          # Check for issues
pnpm lint:fix      # Auto-fix issues
```

**Configuration:** `eslint.config.js` (ES module format)

## Directory Structure
```
tests/
├── api/              ← API Layer
│   ├── builders/     ← Request builders (BaseRequestBuilder)
│   ├── constants/    ← StatusCode, Headers, ContentType
│   ├── routes/       ← Endpoint definitions
│   ├── schemas/      ← Zod schemas for validation
│   └── services/     ← Domain services (SearchService)
├── pages/            ← Page Objects (atomic actions)
├── steps/            ← Steps Classes (receive PO via DI)
├── specs/            ← Test specs (.spec.ts)
├── fixtures/         ← Playwright fixtures
│   ├── pages.fixture.ts   ← Page Object instances
│   ├── steps.fixture.ts   ← Steps (injects POs)
│   ├── api.fixture.ts     ← API layer
│   └── index.ts           ← Merged export
└── data/             ← Test data (environment/, auth/)

utils/
├── api-client.ts        ← HTTP wrapper
├── config.ts            ← Environment configuration
├── decorators.ts        ← @step decorator
├── parse-response.ts    ← Zod validation utility
├── matchers.ts          ← Custom Playwright matchers
├── secrets.ts           ← Credentials from env vars
├── test-data-generator.ts ← Random data (Faker.js)
├── test-data-provider.ts  ← Static data from JSON
└── json-loader.ts       ← JSON file loading
```

## Architecture

```
Gherkin Spec Files       ← AI Input (Ephemeral, NOT committed)
     ↓
Test Files (.spec.ts)    ← Test Layer (uses fixtures)
     ↓
Steps Classes (.ts)      ← Business Logic (receives PO via DI)
     ↓
Page Objects (.ts)       ← Page Layer (atomic actions)
     ↓
Playwright API           ← Browser Automation

API Tests:
Test Files (.spec.ts)    ← Test Layer
     ↓
API Services (.ts)       ← Domain logic (SearchService)
     ↓
ApiClient                ← Thin wrapper around Playwright APIRequestContext
     ↓
Zod Schemas              ← Response validation (in tests)
```

## Fixture Chain
```
pages.fixture.ts (base, extends custom matchers)
       ↓
api.fixture.ts (adds API services)
       ↓
steps.fixture.ts (adds Steps classes)
       ↓
index.ts (exports test + expect)
```

**Note:** Custom matchers (`toHaveStatusCode`) are extended once at the lowest level (`pages.fixture.ts`) to avoid duplicate extensions.

## Supported Browsers
Chromium, Firefox, WebKit

## Path Aliases Configuration

The framework uses TypeScript path aliases for clean, maintainable imports. All imports should use path aliases instead of relative paths.

### Available Aliases

| Alias | Maps To | Usage |
|-------|---------|-------|
| `@pages` | `tests/pages` | Page Objects (barrel export) |
| `@pages/*` | `tests/pages/*` | Specific Page Object files |
| `@steps` | `tests/steps` | Steps classes (barrel export) |
| `@steps/*` | `tests/steps/*` | Specific Steps files |
| `@api` | `tests/api` | API layer (barrel export) |
| `@api/*` | `tests/api/*` | API services, routes, schemas, builders |
| `@fixtures` | `tests/fixtures` | Test fixtures (barrel export) |
| `@fixtures/*` | `tests/fixtures/*` | Specific fixture files |
| `@utils/*` | `utils/*` | Utility functions |
| `@data/*` | `tests/data/*` | Test data files |

### Import Examples

```typescript
// ✅ GOOD: Use path aliases
import { test } from '@fixtures';
import { WikipediaLoginPage } from '@pages/WikipediaLoginPage';
import { WikipediaLoginSteps } from '@steps/WikipediaLoginSteps';
import { getEnvironment } from '@utils/config';
import { SearchService } from '@api/services';

// ✅ GOOD: Barrel exports
import { WikipediaMainPage, WikipediaLoginPage } from '@pages';
import { WikipediaMainSteps, WikipediaLoginSteps } from '@steps';

// ❌ BAD: Relative paths
import { test } from '../fixtures';
import { WikipediaLoginPage } from '../pages/WikipediaLoginPage';
import { getEnvironment } from '../../utils/config';
```

### Configuration

Path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pages": ["tests/pages"],
      "@pages/*": ["tests/pages/*"],
      "@steps": ["tests/steps"],
      "@steps/*": ["tests/steps/*"],
      "@api": ["tests/api"],
      "@api/*": ["tests/api/*"],
      "@fixtures": ["tests/fixtures"],
      "@fixtures/*": ["tests/fixtures/*"],
      "@utils/*": ["utils/*"],
      "@data/*": ["tests/data/*"]
    }
  }
}
```

Playwright automatically recognizes these path aliases when running tests.