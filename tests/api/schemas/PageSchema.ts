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

/**
 * Schema for CSRF Token response from MediaWiki Action API
 * Endpoint: /w/api.php?action=query&meta=tokens&type=csrf
 */
export const CsrfTokenSchema = z.object({
    batchcomplete: z.string().optional(),
    query: z.object({
        tokens: z.object({
            csrftoken: z.string().min(1),
        }),
    }),
});

export type CsrfTokenResponse = z.infer<typeof CsrfTokenSchema>;

/**
 * Schema for Page Edit success response from MediaWiki Action API
 * Endpoint: /w/api.php?action=edit
 */
export const PageEditSuccessSchema = z.object({
    edit: z.object({
        result: z.literal('Success'),
        pageid: z.number().int().positive(),
        title: z.string().min(1),
        contentmodel: z.string().optional(),
        oldrevid: z.number().int(),
        newrevid: z.number().int().positive(),
        newtimestamp: z.string(),
        new: z.string().optional(),
    }),
});

export type PageEditSuccessResponse = z.infer<typeof PageEditSuccessSchema>;