/**
 * Wikipedia Page API Routes
 * @see https://api.wikimedia.org/wiki/Core_REST_API
 * @see https://www.mediawiki.org/wiki/API:Edit
 */
export const PageRoutes = {
    /** Get page content in bare format (REST API) */
    GET_BARE: (title: string) => `/page/${title}/bare`,
} as const;

/**
 * MediaWiki Action API Routes (for write operations)
 * @see https://www.mediawiki.org/wiki/API:Main_page
 */
export const MediaWikiActionRoutes = {
    /** MediaWiki Action API endpoint */
    API: '/w/api.php',
} as const;
