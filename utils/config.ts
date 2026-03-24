import { config as loadDotenv } from 'dotenv';
import { resolvePath, fileExists } from './file-utils';
import { loadJson } from './json-loader';

// Load .env file only if it exists (local dev)
// On CI, environment variables are set directly
const envPath = resolvePath('.env');
if (fileExists(envPath)) {
    loadDotenv({ path: envPath });
}

/**
 * Environment configuration interface
 */
export interface Environment {
    name: string;
    baseUrl: string;
    api: {
        apiUrl: string;
        metaRestUrl: string;
    };
    wikipedia: {
        landingUrl: string;
        mainPageUrl: string;
    };
    timeouts: {
        navigation: number;
        action: number;
        assertion: number;
        defaultDelay: number;
        explicitWait: number;
        loaderAppear: number;
        loaderDisappear: number;
        pageLoad: number;
    };
}

export interface TestEnvironment {
    name: string;
    baseUrl: string;
    api: {
        apiUrl: string;
    };
    testSite: {
        landingUrl: string;
        mainPageUrl: string;
    };
    timeouts: {
        navigation: number;
        action: number;
        assertion: number;
        defaultDelay: number;
        explicitWait: number;
        loaderAppear: number;
        loaderDisappear: number;
        pageLoad: number;
    };
}

/**
 * Get current environment name from ENV variable
 * @default 'dev'
 */
function getEnvName(): string {
    return process.env.ENV || 'dev';
}

/**
 * Get environment configuration
 * Loads from tests/data/environment/{ENV}.json
 * @returns Environment configuration object with URLs, timeouts, and API endpoints
 */
export function getEnvironment(): Environment {
    const envName = getEnvName();
    const configData = loadJson(`tests/data/environment/${envName}`);

    return {
        name: configData.environment as string,
        baseUrl: configData.baseUrl as string,
        api: configData.api as Environment['api'],
        wikipedia: configData.wikipedia as Environment['wikipedia'],
        timeouts: configData.timeouts as Environment['timeouts']
    };
}

/**
 * Get environment configuration
 * Loads from tests/data/environment/{ENV}.json
 * @returns Environment configuration object with URLs, timeouts, and API endpoints
 */
export function getTestEnvironment(): TestEnvironment {
    const configData = loadJson('tests/data/environment/test');

    return {
        name: configData.environment as string,
        baseUrl: configData.baseUrl as string,
        api: configData.api as TestEnvironment['api'],
        testSite: configData.testSite as TestEnvironment['testSite'],
        timeouts: configData.timeouts as TestEnvironment['timeouts']
    };
}
