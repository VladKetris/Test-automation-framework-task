import test from '@playwright/test';

/**
 * Decorator for marking methods as test steps with optional name
 * @param stepName - Optional step name (supports {0}, {1} placeholders for arguments)
 * @returns Decorator function
 */
export function step(stepName?: string) {
    return function decorator<T extends (...args: any[]) => any>(
        target: T,
        context: ClassMethodDecoratorContext<unknown, T>
    ): T {
        return function replacementMethod(this: any, ...args: any[]) {
            let name = stepName || `${this.constructor.name}.${context.name as string}`;
            
            // Replace placeholders {0}, {1}, {2}, etc. with actual argument values
            if (stepName && stepName.includes('{')) {
                name = stepName.replace(/\{(\d+)\}/g, (match, index) => {
                    const argIndex = parseInt(index, 10);
                    if (argIndex < args.length) {
                        return String(args[argIndex]);
                    }
                    return match; // Keep placeholder if argument doesn't exist
                });
            }
            
            return test.step(
                name,
                async () => {
                    return await target.call(this, ...args);
                },
                { box: true }
            );
        } as T;
    };
}