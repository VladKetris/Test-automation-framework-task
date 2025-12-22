/**
 * MediaWiki Action API constants
 * @see https://www.mediawiki.org/wiki/API:Main_page
 */
export const MediaWikiAction = {
    QUERY: 'query',
    EDIT: 'edit',
} as const;

/**
 * MediaWiki API format constants
 */
export const MediaWikiFormat = {
    JSON: 'json',
} as const;

/**
 * MediaWiki query meta constants
 */
export const MediaWikiMeta = {
    TOKENS: 'tokens',
} as const;

/**
 * MediaWiki token type constants
 */
export const MediaWikiTokenType = {
    CSRF: 'csrf',
} as const;

/**
 * MediaWiki edit operation constants
 */
export const MediaWikiEditOption = {
    CREATE_ONLY: '1',
} as const;

