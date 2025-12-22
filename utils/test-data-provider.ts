import { loadJson, JSON_PATHS } from './json-loader';
import { getRandomItem } from './array-utils';

export function getRandomArticle(): string {
    return getRandomItem(getAllArticles());
}

export function getAllArticles(): string[] {
    const data = loadJson(JSON_PATHS.WIKIPEDIA_ARTICLES);
    return data.articles as string[];
}

export function getEditableArticle(): string {
    return getRandomItem(getAllEditableArticles());
}

export function getAllEditableArticles(): string[] {
    const data = loadJson(JSON_PATHS.WIKIPEDIA_ARTICLES);
    return data.editableArticles as string[];
}

