import { loadJson, JSON_PATHS } from './json-loader';
import { getRandomItem } from './array-utils';

/**
 * Get a random Wikipedia article title for UI testing
 * @returns Random article title string
 */
export function getRandomArticle(): string {
    return getRandomItem(getAllArticles());
}

/**
 * Get all Wikipedia articles from test data
 * @returns Array of article title strings
 */
export function getAllArticles(): string[] {
    const data = loadJson(JSON_PATHS.WIKIPEDIA_ARTICLES);
    return data.articles as string[];
}

