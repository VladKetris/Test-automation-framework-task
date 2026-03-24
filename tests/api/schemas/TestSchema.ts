import { z } from 'zod';

export const BaseTestUserResponseSchema = z.object({
    responseCode: z.number(),
});

export const TestUserBaseSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    title: z.string(),
    birth_day: z.string(),
    birth_month: z.string(),
    birth_year: z.string(),
    company: z.string().optional(),
    address1: z.string().min(1),
    address2: z.string().optional(),
    country: z.string().min(1),
    zipcode: z.string().min(1),
    state: z.string().min(1),
    city: z.string().min(1),
});

/**
 * Schema for new user creation payload
 */
export const CreateTestUserPayloadSchema = TestUserBaseSchema.extend({
    password: z.string().min(8),
    birth_date: z.string().optional(),
    birth_day: z.coerce.number().min(1).max(31).optional(),
    birth_month: z.coerce.number().min(1).max(12).optional(),
    birth_year: z.coerce.number().max(2026).optional(),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    mobile_number: z.string().min(9),
    title: z.string().optional().default(''),
});

/**
 * Schema for test user details returned by GET user endpoint
 */
export const TestUserResponseSchema = TestUserBaseSchema.extend({
    id: z.number(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
});

/**
 * Schema for test user details response
 */
export const GetTestUserDetailsResponseSchema = BaseTestUserResponseSchema.extend({
    user: TestUserResponseSchema,
});

/**
 * Schema for test user creation response
 */
export const CommonTestUserDetailsResponseSchema = BaseTestUserResponseSchema.extend({
    message: z.string(),
});

/**
 * Schema for user deletion
 */
export const DeleteTestUserSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

// Infer TypeScript types from schemas
export type CreateTestUserPayload = z.infer<typeof CreateTestUserPayloadSchema>;
export type TestUserResponse = z.infer<typeof TestUserResponseSchema>;
export type DeleteTestUserPayload = z.infer<typeof DeleteTestUserSchema>;
export type TestUserCredentials = DeleteTestUserPayload;
