import { test as pagesTest } from './pages.fixture';
import { ApiClient } from '@utils/api-client';
import { SearchService } from '@api/services';
import { getEnvironment } from '../../utils/config';
import { AuthService } from '@api/services/AuthService';
import { PageService } from '@api/services';
import { expect } from '@playwright/test';
import { matchers } from '@utils/matchers';

// Extend expect with custom matchers for API tests
expect.extend(matchers);

/**
 * API Fixture Types
 */
type ApiFixtures = {
    /** Core client for ad-hoc API calls (uses baseUrl) */
    apiClient: ApiClient;

    /** Search service for Wikipedia Search API (uses apiUrl) */
    searchService: SearchService;

    authService: AuthService;
    pageService: PageService;
};

/**
 * Extended test fixture with API utilities.
 * 
 * Provides:
 * - apiClient: Generic HTTP wrapper for direct API calls
 * - searchService: Domain-specific search operations
 * 
 * @example
 * import { test, expect } from '@fixtures/api.fixture';
 * 
 * test('search via API', async ({ searchService }) => {
 *     const results = await searchService.search('JavaScript');
 *     expect(results.pages.length).toBeGreaterThan(0);
 * });
 */
export const test = pagesTest.extend<ApiFixtures>({
    apiClient: async ({ request }, use) => {
        const env = getEnvironment();
        await use(new ApiClient(request, env.baseUrl));
    },

    authService: async ({ request }, use) => {
        const env = getEnvironment();
        const client = new ApiClient(request, env.api.metaRestUrl);
        await use(new AuthService(client));
    },

    searchService: async ({ request }, use) => {
        const env = getEnvironment();
        const client = new ApiClient(request, env.api.apiUrl);
        await use(new SearchService(client));
    },

    pageService: async ({ request }, use) => {
        const env = getEnvironment();
        const client = new ApiClient(request, env.api.apiUrl);
        await use(new PageService(client));
    },
});
