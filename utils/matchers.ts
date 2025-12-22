import { APIResponse } from '@playwright/test';

export const matchers = {
    async toHaveStatusCode(response: APIResponse, expectedCode: number) {
        const name = 'toHaveStatusCode';
        const received = response.status();
        const pass = received === expectedCode;

        if (pass) {
            return {
                message: () => `expected response status to not be ${expectedCode}`,
                pass: true,
                name,
                expected: expectedCode,
                actual: received,
            };
        } else {
            return {
                message: () => `Expected status code ${expectedCode}, but received ${received}`,
                pass: false,
                name,
                expected: expectedCode,
                actual: received,
            };
        }
    },
};
