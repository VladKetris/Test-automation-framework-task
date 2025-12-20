import { randomNumber } from './test-data-generator';

/**
 * Get a random item from an array
 * @param array - Array to pick from
 * @returns Random item from the array
 */
export function getRandomItem<T>(array: T[]): T {
    const index = randomNumber(0, array.length - 1);
    return array[index];
}