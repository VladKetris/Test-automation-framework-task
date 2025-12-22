# Playwright TypeScript Automation Framework

Feature-first Spec-Driven web UI test automation framework using Playwright and TypeScript for reliable, maintainable test automation.

## Quick Start

> 📖 **For detailed setup instructions, see [Getting Started Guide](docs/getting-started.md)**

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Playwright-SDD

# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests with specific tag
npx playwright test --grep "@smoke"

# Run in debug mode
npx playwright test --debug

# Run with UI mode (interactive)
npx playwright test --ui

# View Report
npx playwright show-report
```

### Code Quality

```bash
# TypeScript type checking
pnpm typecheck

# ESLint code quality check
pnpm lint

# Auto-fix ESLint issues
pnpm lint:fix

# Run all checks
pnpm typecheck && pnpm lint
```

## Environment Configuration

### Required Environment Variables

The framework requires the following environment variables to be set:

- `BASE_URL` - Application base URL (e.g., https://example.com)
- `USERNAME` - Test user username
- `PASSWORD` - Test user password

### Local Development Setup

1. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env** and set your values:
   ```env
   BASE_URL=https://your-app-url.com
   USERNAME=your_test_username
   PASSWORD=your_test_password
   ```

3. **Never commit .env to version control** - it's already in `.gitignore`

### CI/Jenkins Setup

For Jenkins pipelines, use Credentials Binding to inject environment variables:

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                withCredentials([
                    string(credentialsId: 'app-base-url', variable: 'BASE_URL'),
                    usernamePassword(
                        credentialsId: 'test-user-credentials',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD'
                    )
                ]) {
                    sh 'pnpm install'
                    sh 'pnpm test'
                }
            }
        }
    }
}
```

**Security Notes**:
- Passwords are automatically masked in logs
- Never log raw credentials
- Use Jenkins credentials management for sensitive data

## Project Structure

```
Playwright-SDD/
│
├── docs/                      # Documentation
│   ├── workflow.md           # Development workflow
│   ├── tech-stack.md         # Technology stack
│   ├── coding-standards.md   # Code style and naming
│   ├── reporting.md          # Reporting setup
│   ├── patterns/             # Rules and methodology
│   │   ├── locators.md       # Locator extraction process
│   │   ├── page-object.md    # Page Object rules
│   │   ├── step-definition.md # Step definition rules
│   │   ├── feature-input.md  # Gherkin rules
│   │   ├── elements.md       # Framework elements
│   │   └── api-utils.md      # API testing patterns
│   ├── examples/             # Complete implementation examples
│   └── maps/                 # Registry files
│       ├── page-object-map.md # 🔴 MANDATORY: Track existing Page Objects
│       └── steps-map.md       # 🔴 MANDATORY: Track existing Steps
│
├── tests/                     # Test implementation
│   ├── api/                  # API Layer
│   │   ├── builders/         # Request Builders
│   │   ├── constants/        # HTTP Constants
│   │   ├── routes/           # Endpoint definitions
│   │   ├── schemas/          # Zod Schemas
│   │   └── services/         # API Services
│   ├── pages/                # Page Objects
│   ├── steps/                # Step definitions (Action classes)
│   ├── fixtures/             # Test fixtures (context -> pages -> steps -> api -> auth)
│   ├── data/                 # Test data (environment/, auth/)
│   └── specs/                # Spec files (Test Scenarios)
│
├── utils/                     # Utility functions
│   ├── api/                  # API Utilities (ApiClient)
│   ├── config.ts             # Environment & secrets configuration
│   ├── decorators.ts         # @step decorator
│   ├── TestDataGenerator.ts  # Random test data generation
│   ├── JsonLoader.ts         # JSON file loader
│   └── parseResponse.ts      # Zod validation utility
│
├── playwright.config.ts      # Playwright configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Core Process: Spec Driven Development

**Input**: Gherkin Spec (AI Prompt) → **AI Agent** → **Output**: Pure Playwright TypeScript Test

1.  **Spec Definition**: Define scenarios in Gherkin format (Given/When/Then) to use as a prompt for the AI.
2.  **AI Generation**: The AI Agent converts the Gherkin spec into executable Playwright code.
3.  **Locator Reuse**: Prefer existing Page Objects and existing locators/methods (check `page-object-map.md`).
4.  **Locator Extraction**: For new elements, use [MCP-based methodology](docs/patterns/locators.md) with visual analysis.
5.  **Page Objects**: AI creates/reuses Page Objects in `tests/pages/` with verified, unique locators.
6.  **Step Implementation**: AI implements logic in `tests/steps/` or directly in tests using Page Objects.
7.  **Validation**: Run `pnpm typecheck && pnpm lint && pnpm test` to ensure quality.

## Key Features

-   **TypeScript**: Type-safe, modern implementation with path aliases (`@pages`, `@steps`, `@api`, `@fixtures`, `@utils`, `@data`)
-   **Playwright Test Runner**: Fast, reliable, parallel execution
-   **Page Object Model**: Maintainable UI abstraction with BasePage checks
-   **MCP-Based Locators**: Visual analysis and verification via Playwright MCP
-   **Spec Driven**: Tests derived from business specifications (Gherkin → AI → Code)
-   **ESLint Integration**: TypeScript and Playwright-specific linting rules
-   **Reusable Components**: DRY principle enforcement with centralized maps

## Documentation

### Start Here
0.  **[Getting Started](docs/getting-started.md)** - Framework setup and first steps ⭐ **NEW**
1.  **[Rules for contributors](.cursorrules)** - Single source of truth for code structure & conventions
2.  **[Workflow](docs/workflow.md)** - Development process
3.  **[Page Object Map](docs/maps/page-object-map.md)** - 🔴 Check before coding
4.  **[Tech Stack](docs/tech-stack.md)** - Technologies used

### Patterns (Rules)
-   **[Locators](docs/patterns/locators.md)** - Locator extraction methodology (MCP-based)
-   **[Page Objects](docs/patterns/page-object.md)** - Page Object rules
-   **[Step Definitions](docs/patterns/step-definition.md)** - Step rules
-   **[Elements](docs/patterns/elements.md)** - Framework elements

### Examples
-   **[Locator Extraction](docs/examples/locator-extraction-example.md)** - Wikipedia Login Page example
-   **[Page Object](docs/examples/page-object-example.md)**

## Best Practices

### ✅ Do's
-   **Check maps/page-object-map.md BEFORE creating any code**
-   Reuse existing Page Objects/locators before adding anything new
-   Follow [locator extraction methodology](docs/patterns/locators.md) for new locators
-   Verify locator uniqueness via MCP before implementation
-   Always add `.describe()` to locators for debugging
-   Create one Page Object per unique page/URL
-   **Update maps/page-object-map.md AFTER creating new code**

### ❌ Don'ts
-   Create locators without uniqueness verification
-   Create duplicate Page Objects or locators
-   Skip `.describe()` on locators
-   Use direct Playwright calls in tests (use Page Objects)
-   Hard-code test data in code
-   Use `page.waitForTimeout()` (manual sleep)

## Support

For issues or questions:
-   Check [Examples](docs/examples/) for common scenarios