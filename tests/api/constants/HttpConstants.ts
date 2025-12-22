/**
 * Common HTTP Headers for API testing
 */
export const Headers = {
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization',
    ACCEPT: 'Accept',
    CACHE_CONTROL: 'Cache-Control',
    USER_AGENT: 'User-Agent',
} as const;

/**
 * Common Content-Type values
 */
export const ContentType = {
    JSON: 'application/json',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    MULTIPART_FORM: 'multipart/form-data',
    TEXT_PLAIN: 'text/plain',
    TEXT_HTML: 'text/html',
} as const;

/**
 * Authentication scheme constants
 */
export const AuthScheme = {
    BEARER: 'Bearer',
} as const;

/**
 * Build Bearer token Authorization header value
 * @param token - Access token
 * @returns Formatted Authorization header value (e.g., "Bearer <token>")
 */
export function buildBearerAuthHeader(token: string): string {
    return `${AuthScheme.BEARER} ${token}`;
}
