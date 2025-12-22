import * as fs from 'fs';
import * as path from 'path';

/**
 * Resolve path relative to current working directory
 * @param paths - Path segments to resolve
 * @returns Resolved absolute path
 */
export function resolvePath(...paths: string[]): string {
    return path.resolve(process.cwd(), ...paths);
}

/**
 * Read file contents as string
 * @param filePath - Path to the file to read
 * @returns File contents as string
 */
export function readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Check if file exists
 * @param filePath - Path to the file to check
 * @returns True if file exists, false otherwise
 */
export function fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}
