import { APIResponse } from '@playwright/test';
import { ApiClient } from '@utils/api-client';
import { SearchRoutes } from '@api/routes';


/**
 * Search Service for Wikipedia Search API.
 * 
 * @example
 * const results = await searchService.search('JavaScript');
 * console.log(results.pages[0].title);
 */
export class SearchService {
    constructor(private readonly apiClient: ApiClient) { }

    /**
     * Search pages by content
     * @param query - Search query
     * @param limit - Maximum number of results (default: 10)
     * @returns Raw API Response
     */
    async search(query: string, limit = 10): Promise<APIResponse> {
        return this.apiClient.get(SearchRoutes.SEARCH_PAGE, {
            params: { q: query, limit }
        });
    }

    /**
     * Search pages by title only
     * @param title - Title to search for
     * @param limit - Maximum number of results (default: 10)
     * @returns Raw API Response
     */
    async searchByTitle(title: string, limit = 10): Promise<APIResponse> {
        return this.apiClient.get(SearchRoutes.SEARCH_TITLE, {
            params: { q: title, limit }
        });
    }

    /**
     * Get autocomplete suggestions
     * @param query - Search query for autocomplete
     * @param limit - Maximum number of suggestions (default: 10)
     * @returns Raw API Response
     */
    async autocomplete(query: string, limit = 10): Promise<APIResponse> {
        return this.apiClient.get(SearchRoutes.SEARCH_AUTOCOMPLETE, {
            params: { q: query, limit }
        });
    }
}
