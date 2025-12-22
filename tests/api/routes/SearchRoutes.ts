/**
 * Wikipedia Search API Routes
 * @see https://api.wikimedia.org/wiki/Core_REST_API
 */
export const SearchRoutes = {
    /** Search pages by content */
    SEARCH_PAGE: '/search/page',

    /** Search pages by title only */
    SEARCH_TITLE: '/search/title',

    /** Autocomplete suggestions */
    SEARCH_AUTOCOMPLETE: '/search/autocomplete',
} as const;
