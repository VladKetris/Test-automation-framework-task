/**
 * OAuth 2.0 Grant Types and related constants
 */
export const GrantType = {
    CLIENT_CREDENTIALS: 'client_credentials',
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
    PASSWORD: 'password',
} as const;

export type GrantTypeType = (typeof GrantType)[keyof typeof GrantType];
