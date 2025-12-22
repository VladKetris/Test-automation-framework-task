/**
 * Wikipedia Page API Routes
 * @see https://api.wikimedia.org/wiki/Core_REST_API
 */
export const PageRoutes = {
    /** Get page content in bare format */
    GET_BARE: (title: string) => `/page/${title}/bare`,
};
