/**
 * Get environment variable with validation
 * @throws Error if variable is missing or empty
 */
function getRequiredEnvVar(name: string): string {
    const value = process.env[name];

    if (!value || value.trim() === '') {
        throw new Error(
            `Missing required environment variable: ${name}\n\n` +
            `Add to your .env file: ${name}=your_value`
        );
    }

    return value;
}

/**
 * Get Wikipedia credentials from environment variables
 * @returns Object containing username and password
 */
export function getWikipediaCredentials(): { username: string; password: string } {
    return {
        username: getRequiredEnvVar('WIKI_USERNAME'),
        password: getRequiredEnvVar('WIKI_PASSWORD')
    };
}

/**
 * Get Meta API client credentials for OAuth
 * @returns Object containing client ID and client secret
 */
export function getMetaApiCredentials(): { clientId: string; clientSecret: string } {
    return {
        clientId: getRequiredEnvVar('WIKI_META_CLIENT_ID'),
        clientSecret: getRequiredEnvVar('WIKI_META_CLIENT_SECRET')
    };
}
