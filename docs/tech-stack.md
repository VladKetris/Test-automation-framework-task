# Tech Stack

## Core Technologies
- **TypeScript 5.0+** - Implementation language
- **Playwright** - Browser automation with auto-waiting
- **Playwright Test Runner** - Native test runner
- **Playwright HTML Reporter** - Built-in reporting
- **Zod** - Runtime schema validation for API responses
- **Path Aliases** - TypeScript path mapping for clean imports (`@pages`, `@steps`, `@api`, `@fixtures`, `@utils`, `@data`)

## Framework Components
- **Page Object Model** - UI abstraction pattern (see `tests/pages/`)
- **Steps Classes** - Business logic layer (see `tests/steps/`)
- **API Layer** - API services, routes, schemas (see `tests/api/`)
- **Fixtures** - Dependency injection for tests (see `tests/fixtures/`)
- **BasePage Check Methods** - Centralized element state validation
- **HTML Reports** - Comprehensive reporting with screenshots, traces, and videos

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
├── api/              ← API Utilities (ApiClient)
├── config.ts         ← Environment & secrets
├── decorators.ts     ← @step decorator
├── parseResponse.ts  ← Zod validation utility
├── matchers.ts       ← Custom Playwright matchers
├── TestDataGenerator.ts
├── TestDataProvider.ts
└── JsonLoader.ts
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
pages.fixture → api.fixture → steps.fixture
```

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