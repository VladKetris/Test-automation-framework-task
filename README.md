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
npx playwright test tests/specs/wikipedia-login.spec.ts

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

# Run all checks before commit
pnpm typecheck && pnpm lint && pnpm test
```

---

## Environment Configuration

### Required Environment Variables

The framework requires the following environment variables:

| Variable | Description |
|----------|-------------|
| `ENV` | Environment name (`dev`, `prod`) |
| `WIKI_USERNAME` | Wikipedia test user username |
| `WIKI_PASSWORD` | Wikipedia test user password |
| `WIKI_META_CLIENT_ID` | OAuth client ID (for API tests) |
| `WIKI_META_CLIENT_SECRET` | OAuth client secret (for API tests) |

### Local Development Setup

1. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env** and set your values:
   ```env
   ENV=dev
   WIKI_USERNAME=your_test_username
   WIKI_PASSWORD=your_test_password
   WIKI_META_CLIENT_ID=your_client_id
   WIKI_META_CLIENT_SECRET=your_client_secret
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
                    usernamePassword(
                        credentialsId: 'wikipedia-credentials',
                        usernameVariable: 'WIKI_USERNAME',
                        passwordVariable: 'WIKI_PASSWORD'
                    ),
                    string(credentialsId: 'wiki-client-id', variable: 'WIKI_META_CLIENT_ID'),
                    string(credentialsId: 'wiki-client-secret', variable: 'WIKI_META_CLIENT_SECRET')
                ]) {
                    sh 'pnpm install'
                    sh 'pnpm exec playwright install --with-deps'
                    sh 'pnpm test'
                }
            }
        }
    }
}
```

---

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
│   │   ├── locators.md       # Locator extraction (MCP-based)
│   │   ├── page-object.md    # Page Object rules
│   │   ├── step-definition.md # Step definition rules
│   │   ├── elements.md       # Framework elements
│   │   ├── api-utils.md      # API testing patterns
│   │   └── test-data-management.md # Test data patterns
│   ├── examples/             # Complete implementation examples
│   └── maps/                 # Registry files
│       ├── page-object-map.md # 🔴 MANDATORY: Track existing Page Objects
│       └── steps-map.md       # 🔴 MANDATORY: Track existing Steps
│
├── tests/                     # Test implementation
│   ├── api/                  # API Layer
│   │   ├── builders/         # Request Builders
│   │   ├── constants/        # StatusCode, Headers, ContentType
│   │   ├── routes/           # Endpoint definitions
│   │   ├── schemas/          # Zod Schemas
│   │   └── services/         # API Services
│   ├── pages/                # Page Objects
│   ├── steps/                # Step definitions (Action classes)
│   ├── fixtures/             # Test fixtures
│   ├── data/                 # Test data (environment/, wikipedia/)
│   └── specs/                # Spec files (Test Scenarios)
│
├── utils/                     # Utility functions
│   ├── api-client.ts         # HTTP wrapper
│   ├── config.ts             # Environment configuration
│   ├── decorators.ts         # @step decorator
│   ├── secrets.ts            # Credentials from env vars
│   ├── test-data-generator.ts # Random data (Faker.js)
│   ├── test-data-provider.ts # Static data from JSON
│   ├── parse-response.ts     # Zod validation utility
│   └── matchers.ts           # Custom Playwright assertions
│
├── playwright.config.ts      # Playwright configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## Core Process: Spec Driven Development

**Input**: Gherkin Spec (AI Prompt) → **AI Agent** → **Output**: Pure Playwright TypeScript Test

1. **Spec Definition**: Define scenarios in Gherkin format (Given/When/Then) as AI prompt
2. **AI Generation**: AI Agent converts Gherkin spec into executable Playwright code
3. **Locator Reuse**: Check `page-object-map.md` for existing Page Objects and locators
4. **Locator Extraction**: For new elements, use [MCP-based methodology](docs/patterns/locators.md)
5. **Page Objects**: Create/reuse Page Objects with verified, unique locators
6. **Step Implementation**: Implement logic in Steps classes or directly using Page Objects
7. **Validation**: Run `pnpm typecheck && pnpm lint && pnpm test`

---

## Key Features

| Feature | Description |
|---------|-------------|
| **TypeScript** | Type-safe implementation with path aliases (`@pages`, `@steps`, `@api`, `@utils`) |
| **Playwright** | Fast, reliable, parallel test execution |
| **Page Object Model** | Maintainable UI abstraction with BasePage checks |
| **MCP-Based Locators** | Visual analysis and verification via Playwright MCP |
| **Spec Driven** | Tests derived from Gherkin specifications |
| **ESLint** | TypeScript and Playwright-specific linting rules |
| **Zod Schemas** | Runtime API response validation |
| **ReportPortal** | Centralized test reporting (optional) |

---

## Documentation

### Start Here
0. **[Getting Started](docs/getting-started.md)** - Framework setup and first steps
1. **[Rules for contributors](.cursorrules)** - Single source of truth for conventions
2. **[Workflow](docs/workflow.md)** - Development process
3. **[Page Object Map](docs/maps/page-object-map.md)** - 🔴 Check before coding
4. **[Tech Stack](docs/tech-stack.md)** - Technologies used

### Patterns (Rules)
- **[Locators](docs/patterns/locators.md)** - Locator extraction methodology (MCP-based)
- **[Page Objects](docs/patterns/page-object.md)** - Page Object rules
- **[Step Definitions](docs/patterns/step-definition.md)** - Step rules
- **[Elements](docs/patterns/elements.md)** - Framework elements
- **[API Utils](docs/patterns/api-utils.md)** - API testing patterns
- **[Test Data](docs/patterns/test-data-management.md)** - Test data management

### Examples
- **[Locator Extraction](docs/examples/locator-extraction-example.md)** - Wikipedia Login Page
- **[Page Object](docs/examples/page-object-example.md)** - Complete Page Object
- **[Steps Class](docs/examples/steps-example.md)** - Steps with DI pattern
- **[Test Data](docs/examples/test-data-example.md)** - Random vs static data
- **[Special Cases](docs/examples/special-cases.md)** - Tables, iframes, dialogs
- **[Reporting](docs/examples/reporting-example.md)** - HTML and ReportPortal

---

## Best Practices

### ✅ Do's
- **Check maps/page-object-map.md BEFORE creating any code**
- Reuse existing Page Objects/locators before adding anything new
- Follow [locator extraction methodology](docs/patterns/locators.md) for new locators
- Verify locator uniqueness via MCP before implementation
- Always add `.describe()` to locators for debugging
- Use arrow functions for dynamic/parameterized locators
- Use `StatusCode` constants instead of magic numbers
- Create one Page Object per unique page/URL
- **Update maps/page-object-map.md AFTER creating new code**

### ❌ Don'ts
- Create locators without uniqueness verification
- Create duplicate Page Objects or locators
- Skip `.describe()` on locators
- Use inline locator creation in methods (use arrow functions)
- Use direct Playwright calls in tests (use Page Objects)
- Hard-code test data or status codes
- Use `page.waitForTimeout()` (manual sleep)
- Use `return await` together (redundant)

---

## Support

For issues or questions:
- Check [Examples](docs/examples/) for common scenarios
- Review [Coding Standards](docs/coding-standards.md) for rules
- See [.cursorrules](.cursorrules) for complete conventions
