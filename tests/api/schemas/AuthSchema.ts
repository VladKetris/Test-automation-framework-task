import { z } from 'zod';

/**
 * Schema for Access Token Response
 * Standard OAuth2 token response
 */
export const AccessTokenSchema = z.object({
    access_token: z.string().min(1, {
        message: 'Access token should not be empty',
    }),
    token_type: z.string().min(1),
    expires_in: z.number().int().nonnegative(),
    scope: z.string().optional(),
}).refine(
    (data) => data.token_type.toLowerCase() === 'bearer',
    {
        message: 'Token type should be bearer',
        path: ['token_type'],
    }
).refine(
    (data) => data.expires_in > 0,
    {
        message: 'Expires in should be a positive number',
        path: ['expires_in'],
    }
);

// Infer TypeScript types from schemas
export type AccessTokenResponse = z.infer<typeof AccessTokenSchema>;
