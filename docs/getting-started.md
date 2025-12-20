# Getting Started with Playwright SDD Framework

This guide will help you set up and start using the Playwright Spec-Driven Development (SDD) framework.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **pnpm** package manager (recommended) or npm
  ```bash
  # Install pnpm globally
  npm install -g pnpm
  ```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Playwright-SDD
```

### 2. Install Dependencies

```bash
# Install project dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install
```

### 3. Verify Installation

```bash
# Check TypeScript compilation
pnpm typecheck

# Run a sample test (if available)
pnpm test
```

## Environment Setup

### Required Environment Variables

The framework requires environment variables for configuration. Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

### Environment Variables

Add the following to your `.env` file:

```env
# Application Base URL
BASE_URL=https://example.com

# Test User Credentials
USERNAME=your_test_username
PASSWORD=your_test_password

# Optional: Environment identifier
ENV=dev

# Optional: ReportPortal configuration (if using)
REPORTPORTAL_API_KEY=your_api_key
REPORTPORTAL_ENDPOINT=https://your-reportportal.com
REPORTPORTAL_PROJECT=your_project_name
```

**Security Note**: The `.env` file is already in `.gitignore`. Never commit sensitive credentials to version control.

### Environment Configuration Files

The framework uses JSON files for environment-specific data:

- `tests/data/environment/` - Environment URLs and configuration
- `tests/data/wikipedia/` - Domain-specific test data

See [Test Data Management](patterns/test-data-management.md) for details.

## Project Structure Overview

```
Playwright-SDD/
├── docs/                      # Documentation
│   ├── getting-started.md    # This file
│   ├── workflow.md           # Development workflow
│   ├── tech-stack.md         # Technology stack
│   ├── patterns/             # Framework patterns
│   ├── examples/             # Code examples
│   └── maps/                 # Registry files (check before coding!)
│
├── tests/
│   ├── api/                  # API Layer (services, routes, schemas)
│   ├── pages/                # Page Objects (UI abstraction)
│   ├── steps/                # Steps Classes (business logic)
│   ├── fixtures/             # Test fixtures (dependency injection)
│   ├── data/                 # Test data (JSON files)
│   └── specs/                # Test specifications (.spec.ts)
│
├── utils/                     # Utility functions
│   ├── config.ts             # Environment configuration
│   ├── decorators.ts         # @step decorator
│   ├── test-data-generator.ts # Random data generation
│   └── api-client.ts         # API client wrapper
│
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Understanding the Framework Layers

The framework follows a layered architecture:

```
Test Spec (.spec.ts)
    ↓
Steps Classes (Business Logic)
    ↓
Page Objects (UI Actions)
    ↓
Playwright API
```

### Layer Responsibilities

| Layer | Location | Purpose | Example |
|-------|----------|---------|---------|
| **Test** | `tests/specs/*.spec.ts` | Test scenarios, orchestration | `test('login', async ({ loginSteps }) => {...})` |
| **Steps** | `tests/steps/*Steps.ts` | Business-level actions | `loginSteps.login(username, password)` |
| **Page Objects** | `tests/pages/*Page.ts` | Atomic UI actions | `loginPage.fillUsername(username)` |
| **API** | `tests/api/*` | API services, routes, schemas | `SearchService.search(query)` |

See [Tech Stack](tech-stack.md) for detailed architecture.

## Writing Your First Test

### Step 1: Check Existing Code

**🔴 MANDATORY**: Before writing any code, check the maps:

1. Open `docs/maps/page-object-map.md` - Check existing Page Objects
2. Open `docs/maps/steps-map.md` - Check existing Steps classes
3. Search for similar functionality before creating new code

### Step 2: Create a Simple Test

Let's create a test that navigates to a page and verifies it loaded:

```typescript
// tests/specs/my-first-test.spec.ts
import { test } from '@fixtures';
import { WikipediaMainPage } from '@pages/WikipediaMainPage';
import { WikipediaMainSteps } from '@steps/WikipediaMainSteps';

test.describe('My First Test', () => {
    test('should navigate to main page', async ({ 
        wikipediaMainSteps, 
        wikipediaMainPage 
    }) => {
        await wikipediaMainSteps.openDirectlyAndVerify();
        await wikipediaMainPage.verifyPageOpened();
    });
});
```

### Step 3: Understanding the Test

- **`test`** - Imported from `@fixtures` (provides Steps and Page Objects via dependency injection)
- **`wikipediaMainSteps`** - Business logic layer (handles navigation)
- **`wikipediaMainPage`** - Page Object (verifies page state)
- **Path aliases** - `@fixtures`, `@pages`, `@steps` are TypeScript path aliases

### Step 4: Run Your Test

```bash
# Run specific test file
pnpm test tests/specs/my-first-test.spec.ts

# Run in debug mode
pnpm test tests/specs/my-first-test.spec.ts --debug

# Run with UI mode (interactive)
pnpm test tests/specs/my-first-test.spec.ts --ui
```

## Running Tests

### Basic Commands

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test tests/specs/wikipedia-login.spec.ts

# Run tests matching a pattern
pnpm test --grep "login"

# Run in headed mode (see browser)
pnpm test --headed

# Run in debug mode
pnpm test --debug

# Run with UI mode (interactive)
pnpm test --ui
```

### View Test Reports

```bash
# View HTML report
pnpm exec playwright show-report

# Reports are saved in playwright-report/
```

## Next Steps

### 1. Learn the Patterns

- **[Page Objects](patterns/page-object.md)** - How to create and use Page Objects
- **[Step Definitions](patterns/step-definition.md)** - How to create Steps classes
- **[Test Data Management](patterns/test-data-management.md)** - How to manage test data
- **[API Utilities](patterns/api-utils.md)** - How to test APIs

### 2. Review Examples

- **[Complete Test Example](examples/complete-test-example.md)** - Full test implementation
- **[Page Object Example](examples/page-object-example.md)** - Page Object implementation
- **[Steps Example](examples/steps-example.md)** - Steps class implementation

### 3. Follow the Workflow

- **[Workflow Guide](workflow.md)** - Development process
- **[Coding Standards](coding-standards.md)** - Code style and rules

### 4. Check Before Coding

- **[Page Object Map](maps/page-object-map.md)** - Existing Page Objects
- **[Steps Map](maps/steps-map.md)** - Existing Steps classes

## Common Tasks

### Creating a New Page Object

1. Check `docs/maps/page-object-map.md` for existing Page Objects
2. Create file in `tests/pages/YourPagePage.ts`
3. Inherit from `BasePage`
4. Use `.describe()` on all locators
5. Update `docs/maps/page-object-map.md`

See [Page Object Pattern](patterns/page-object.md) for details.

### Creating a New Steps Class

1. Check `docs/maps/steps-map.md` for existing Steps
2. Create file in `tests/steps/YourSteps.ts`
3. Add `@step` decorator to ALL methods
4. Inject Page Objects via constructor
5. Update `docs/maps/steps-map.md`

See [Step Definition Pattern](patterns/step-definition.md) for details.

### Writing API Tests

1. Create service in `tests/api/services/YourService.ts`
2. Define routes in `tests/api/routes/`
3. Create Zod schemas in `tests/api/schemas/`
4. Use `ApiClient` for HTTP calls
5. Validate responses with Zod schemas

See [API Utilities Pattern](patterns/api-utils.md) for details.

## Troubleshooting

### TypeScript Errors

```bash
# Check for type errors
pnpm typecheck
```

### Tests Not Finding Fixtures

- Ensure you import `test` from `@fixtures` (not `@playwright/test`)
- Check that fixtures are properly exported in `tests/fixtures/index.ts`

### Environment Variables Not Loading

- Verify `.env` file exists in project root
- Check that `dotenv` is configured in `playwright.config.ts`
- Restart your IDE/terminal after creating `.env`

### Path Alias Errors

- Verify `tsconfig.json` has correct path mappings
- Restart TypeScript server in your IDE
- Run `pnpm typecheck` to verify configuration

## Additional Resources

- **[Workflow](workflow.md)** - Complete development workflow
- **[Tech Stack](tech-stack.md)** - Framework architecture
- **[Coding Standards](coding-standards.md)** - Code style and rules
- **[Reporting](reporting.md)** - Test reporting setup

## Getting Help

If you encounter issues:

1. Check the [Examples](examples/) directory for similar scenarios
2. Review [Coding Standards](coding-standards.md) for common patterns
3. Check [Workflow](workflow.md) for development process
4. Verify your code follows the patterns in [Patterns](patterns/) directory

