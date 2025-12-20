import { z } from 'zod';

/**
 * Schema for individual search result page
 */
export const SearchPageSchema = z.object({
    id: z.number().int().positive(),
    key: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().optional(),
    matched_title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    thumbnail: z.object({
        mimetype: z.string().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        duration: z.number().int().nonnegative().optional().nullable(),
        url: z.string().min(1),
    }).optional().nullable(),
});

/**
 * Schema for search API response with minimum results requirement
 */
export const SearchResultWithMinSchema = (minResults: number) => z.object({
    pages: z.array(SearchPageSchema).min(minResults, {
        message: `Search should return at least ${minResults} result(s)`,
    }),
});

/**
 * Schema for search API response with maximum results limit
 */
export const SearchResultWithMaxSchema = (maxResults: number) => z.object({
    pages: z.array(SearchPageSchema).max(maxResults, {
        message: `Search should return at most ${maxResults} result(s)`,
    }),
});

// Infer TypeScript types from schemas
export type SearchPage = z.infer<typeof SearchPageSchema>;
