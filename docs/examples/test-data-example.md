# Test Data Example

## Utils Structure

```
utils/
├── config.ts           → Environment config (URLs, timeouts)
├── Secrets.ts          → Credentials from env vars
├── TestDataProvider.ts → High-level API for tests
├── TestDataGenerator.ts → Random data generation
```

---

## Environment Config (URLs, Timeouts)

```typescript
import { getEnvironment } from '@utils/config';

const env = getEnvironment();
console.log(env.wikipedia.mainPageUrl);  // URL from JSON
console.log(env.timeouts.action);         // Timeout from JSON
```

---

## Credentials (from Secrets)

```typescript
import { getWikipediaCredentials } from '@utils/secrets';

// Get credentials from env vars (WIKI_USERNAME, WIKI_PASSWORD)
const { username, password } = getWikipediaCredentials();
```

---

## Random Data Generation

```typescript
import { randomUsername, randomPassword, randomEmail } from '@utils/test-data-generator';

const username = randomUsername();
const password = randomPassword(12);
const email = randomEmail();
```

---

## Complete Test Example

```typescript
import { test } from '@fixtures';
import { getWikipediaCredentials } from '@utils/secrets';
import { randomUsername, randomPassword } from '@utils/test-data-generator';

test.describe('Wikipedia Tests', () => {
    const MIN_PASSWORD_LENGTH = 12;

    test('Create account with random credentials', async ({
        wikipediaLandingSteps,
        wikipediaNavigationMenu,
        wikipediaCreateAccountSteps
    }) => {
        const username = randomUsername();
        const password = randomPassword(MIN_PASSWORD_LENGTH);

        await wikipediaLandingSteps.openAndVerify();
        await wikipediaNavigationMenu.clickCreateAccount();
        await wikipediaCreateAccountSteps.fillAccountForm(username, password);
    });

    test('Login with existing account', async ({
        wikipediaMainSteps,
        wikipediaNavigationMenu,
        wikipediaLoginSteps
    }) => {
        const { username, password } = getWikipediaCredentials();

        await wikipediaMainSteps.openDirectlyAndVerify();
        await wikipediaNavigationMenu.clickLogIn();
        await wikipediaLoginSteps.login(username, password);
    });
});
```

---

## Setup

### Local (.env file)
```
ENV=dev
WIKI_USERNAME=your_username
WIKI_PASSWORD=your_password
```

### CI (environment variables)
```yaml
env:
  ENV: prod
  WIKI_USERNAME: ${{ secrets.WIKI_USERNAME }}
  WIKI_PASSWORD: ${{ secrets.WIKI_PASSWORD }}
```

---

## See Also

- [patterns/test-data-management.md](../patterns/test-data-management.md) - Full pattern guide
