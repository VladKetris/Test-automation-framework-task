import { randomNumber } from './test-data-generator';

/**
 * Get a random item from an array
 * @param array - Array to pick from
 * @returns Random item from the array
 * @throws Error if array is empty
 */
export function getRandomItem<T>(array: T[]): T {
    if (array.length === 0) {
        throw new Error('Cannot get random item from empty array');
    }
    const index = randomNumber(0, array.length - 1);
    return array[index];
}

/**
 * Get multiple random items from an array without duplicates
 * @param array - Array to pick from
 * @param count - Number of items to pick
 * @returns Array of random items (up to count or array length)
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
    if (array.length === 0 || count <= 0) {
        return [];
    }
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param array - Array to shuffle
 * @returns New shuffled array (does not modify original)
 */
export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = randomNumber(0, i);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}