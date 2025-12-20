import { test } from '@fixtures/api.fixture';
import { expect } from '@playwright/test';
import { StatusCode } from '@api/constants';
import { assertSchema } from '@utils/parse-response';
import { 
    SearchResultWithMinSchema, 
    SearchResultWithMaxSchema,
} from '@api/schemas';
import { getRandomArticle } from '@utils/test-data-provider';

test.describe('Wikipedia Search API Tests', () => {

    test('Verify search by content returns valid results', async ({ searchService }) => {
        const SEARCH_QUERY = getRandomArticle();
        const EXPECTED_MIN_RESULTS = 1;

        const response = await searchService.search(SEARCH_QUERY);

        await expect(response).toHaveStatusCode(StatusCode.OK);

        const schema = SearchResultWithMinSchema(EXPECTED_MIN_RESULTS)
            .refine(
                (data) => data.pages.some(page => page.title.toLowerCase().includes(SEARCH_QUERY.toLowerCase())),
                {
                    message: `First result title should contain query: ${SEARCH_QUERY}`,
                }
            );
        
        await assertSchema(response, schema, 'Search Results Response');
    });

    test('Verify search by content with limit parameter', async ({ searchService }) => {
        const SEARCH_QUERY = getRandomArticle();
        const LIMIT = 5;

        const response = await searchService.search(SEARCH_QUERY, LIMIT);

        await expect(response).toHaveStatusCode(StatusCode.OK);

        const schema = SearchResultWithMaxSchema(LIMIT);
        await assertSchema(response, schema, 'Search Results Response');
    });

    test('Verify search by title returns exact matches', async ({ searchService }) => {
        const TITLE_QUERY = getRandomArticle();
        const EXPECTED_MIN_RESULTS = 1;

        const response = await searchService.searchByTitle(TITLE_QUERY);

        await expect(response).toHaveStatusCode(StatusCode.OK);

        const schema = SearchResultWithMinSchema(EXPECTED_MIN_RESULTS);
        await assertSchema(response, schema, 'Search by Title Results Response');
    });

    test('Verify search by title with limit parameter', async ({ searchService }) => {
        const TITLE_QUERY = getRandomArticle();
        const LIMIT = 3;

        const response = await searchService.searchByTitle(TITLE_QUERY, LIMIT);

        await expect(response).toHaveStatusCode(StatusCode.OK);

        const schema = SearchResultWithMaxSchema(LIMIT);
        await assertSchema(response, schema, 'Search by Title Results Response');
    });
});
