import { APIResponse, expect } from '@playwright/test';
import { z } from 'zod';

/**
 * Parse and validate API response with Zod schema.
 * Throws ZodError if validation fails.
 * @param response - API response to parse
 * @param schema - Zod schema for validation
 * @returns Promise resolving to parsed and validated data
 */
export async function parseResponse<T>(
    response: APIResponse,
    schema: z.ZodType<T>
): Promise<T> {
    const json = await response.json();
    return schema.parse(json);
}

/**
 * Safe version that returns result or error instead of throwing.
 * @param response - API response to parse
 * @param schema - Zod schema for validation
 * @returns Promise resolving to safe parse result (success or error)
 */
export async function safeParseResponse<T>(
    response: APIResponse,
    schema: z.ZodType<T>
) {
    const json = await response.json();
    return schema.safeParse(json);
}

/**
 * Validates API response against Zod schema and asserts success.
 * Returns parsed data on success, fails test on error with detailed message.
 * @param response - API response to validate
 * @param schema - Zod schema for validation
 * @param description - Description for error message (default: 'API Response')
 * @returns Promise resolving to parsed and validated data
 */
export async function assertSchema<T>(
    response: APIResponse,
    schema: z.ZodType<T>,
    description: string = 'API Response'
): Promise<T> {
    const validation = await safeParseResponse(response, schema);
    const errorMessage = !validation.success ? validation.error.message : '';

    expect(validation.success, `Schema validation failed for ${description}. Error: ${errorMessage}`).toBeTruthy();

    return validation.data as T;
}