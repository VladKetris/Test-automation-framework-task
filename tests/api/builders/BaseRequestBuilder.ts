export class BaseRequestBuilder<T extends object> {
    protected model: Partial<T>;

    constructor(initial: Partial<T> = {}) {
        this.model = { ...initial };
    }

    /**
     * Apply overrides to the model
     * @param overrides - Partial object to merge with current model
     */
    with(overrides: Partial<T> & Record<string, unknown>): this {
        this.model = { ...this.model, ...overrides };
        return this;
    }

    /**
     * Delete a field from the model
     * @param field - Field name to delete
     */
    delete(field: keyof T): this {
        delete this.model[field];
        return this;
    }

    /**
     * Create a copy of this builder
     */
    clone(): BaseRequestBuilder<T> {
        return new BaseRequestBuilder<T>({ ...this.model });
    }

    /**
     * Build and return the final payload
     */
    build(): Partial<T> {
        return this.model;
    }
}
