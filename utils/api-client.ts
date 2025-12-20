import { APIRequestContext, APIResponse } from '@playwright/test';

type RequestOptions<M extends keyof APIRequestContext> = Parameters<APIRequestContext[M]>[1];

/**
 * HTTP client wrapper for API requests with base URL handling
 */
export class ApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly baseUrl: string
    ) { }

    private buildUrl(path: string): string {
        const base = this.baseUrl.replace(/\/$/, '');
        const endpoint = path.startsWith('/') ? path : `/${path}`;
        return `${base}${endpoint}`;
    }

    /**
     * Send GET request
     * @param url - Endpoint URL path
     * @param options - Optional request options
     * @returns Promise resolving to API response
     */
    get(url: string, options?: RequestOptions<'get'>): Promise<APIResponse> {
        return this.request.get(this.buildUrl(url), options);
    }

    /**
     * Send POST request
     * @param url - Endpoint URL path
     * @param options - Optional request options
     * @returns Promise resolving to API response
     */
    post(url: string, options?: RequestOptions<'post'>): Promise<APIResponse> {
        return this.request.post(this.buildUrl(url), options);
    }

    /**
     * Send PUT request
     * @param url - Endpoint URL path
     * @param options - Optional request options
     * @returns Promise resolving to API response
     */
    put(url: string, options?: RequestOptions<'put'>): Promise<APIResponse> {
        return this.request.put(this.buildUrl(url), options);
    }

    /**
     * Send DELETE request
     * @param url - Endpoint URL path
     * @param options - Optional request options
     * @returns Promise resolving to API response
     */
    delete(url: string, options?: RequestOptions<'delete'>): Promise<APIResponse> {
        return this.request.delete(this.buildUrl(url), options);
    }

    /**
     * Send PATCH request
     * @param url - Endpoint URL path
     * @param options - Optional request options
     * @returns Promise resolving to API response
     */
    patch(url: string, options?: RequestOptions<'patch'>): Promise<APIResponse> {
        return this.request.patch(this.buildUrl(url), options);
    }
}
