import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['error', { 
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': ['warn', {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
            }],
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',

            // General rules
            'no-console': 'warn',
            'no-duplicate-imports': 'error',
            'eqeqeq': ['error', 'always'],
            'prefer-const': 'error',
        },
    },
    {
        // Decorator files - allow 'any' for TypeScript decorators
        files: ['utils/decorators.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        // Zod schema factory functions - return type is inferred
        files: ['tests/api/schemas/**/*.ts'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },
    {
        // Test data generators - return types can be inferred
        files: ['utils/test-data-generator.ts', 'utils/test-data-provider.ts'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },
    {
        // Parse response utilities
        files: ['utils/parse-response.ts'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },
    {
        // Playwright test files
        files: ['tests/specs/**/*.ts'],
        ...playwright.configs['flat/recommended'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/no-wait-for-timeout': 'error',
            'playwright/no-force-option': 'warn',
            'playwright/prefer-web-first-assertions': 'warn',
            'playwright/no-page-pause': 'error',
            // Tests use assertions via Page Objects and Steps (verifyPageOpened, etc.)
            'playwright/expect-expect': ['warn', {
                assertFunctionNames: [
                    'expect',
                    'assertSchema',
                    '**.verify*',
                    '**.assert*',
                ],
            }],
        },
    },
    {
        // Type declaration files - import is used for type augmentation
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    {
        // Ignore patterns
        ignores: [
            'node_modules/**',
            'playwright-report/**',
            'test-results/**',
            '*.config.js',
            '*.config.ts',
        ],
    }
);

