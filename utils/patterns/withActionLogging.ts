export function withActionLogging<T extends object>(target: T, targetName: string): T {
    return new Proxy(target, {
        get(originalTarget, property, receiver) {
            const value = Reflect.get(originalTarget, property, receiver);

            if (typeof value !== 'function') {
                return value;
            }

            return async (...args: unknown[]) => {
                // eslint-disable-next-line no-console
                console.log(`[ActionLog] ${targetName}.${String(property)}(${args.map((arg) => JSON.stringify(arg)).join(', ')})`);
                return value.apply(originalTarget, args);
            };
        },
    });
}
