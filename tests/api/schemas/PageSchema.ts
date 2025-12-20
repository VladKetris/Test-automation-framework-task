import { z } from 'zod';

/**
 * Schema for Page Bare API response
 * Endpoint: /page/{title}/bare
 */
export const PageBareSchema = z.object({
    id: z.number().int().positive(),
    key: z.string().min(1),
    title: z.string().min(1),
    latest: z.object({
        id: z.number().int().positive(),
        timestamp: z.coerce.date(),
    }),
    content_model: z.string().min(1),
    license: z.object({
        url: z.url(),
        title: z.string().min(1),
    }).optional(),
    html_url: z.url().optional(),
});

/**
 * Schema for Page Bare with title validation
 */
export const PageBareWithTitleSchema = (expectedTitle: string) => PageBareSchema.refine(
    (data) => data.title === expectedTitle,
    {
        message: `Page title should match expected title: ${expectedTitle}`,
    }
);

export type PageBareResponse = z.infer<typeof PageBareSchema>;
