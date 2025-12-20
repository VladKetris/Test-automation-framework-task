import { resolvePath, readFile, fileExists } from './file-utils';

export const JSON_PATHS = {
    WIKIPEDIA_ARTICLES: 'tests/data/wikipedia/articles',
} as const;

/**
 * Load JSON file from relative path
 * @param relativePath - Relative path to JSON file (without .json extension)
 * @returns Parsed JSON data as record
 */
export function loadJson(relativePath: string): Record<string, unknown> {
    const fullPath = resolvePath(`${relativePath}.json`);

    if (!fileExists(fullPath)) {
        throw new Error(`JSON file not found: ${fullPath}`);
    }

    return JSON.parse(readFile(fullPath));
}

