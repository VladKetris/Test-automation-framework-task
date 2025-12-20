import { APIResponse } from '@playwright/test';

declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            toHaveStatusCode(expectedCode: number): Promise<R>;
        }
    }
}
