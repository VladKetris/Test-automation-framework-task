import { expect } from '@playwright/test';
import { ProductVerificationInput } from '@sharedTypes/demoblazeTypes';
import { normalizeString } from '@utils/string-utils';

export interface ProductVerificationStrategy {
    verify(input: ProductVerificationInput, fieldName: keyof ProductVerificationInput['expected']): Promise<void>;
}

export class PriceValidationStrategy implements ProductVerificationStrategy {
    async verify(input: ProductVerificationInput, fieldName: keyof ProductVerificationInput['expected']): Promise<void> {
        expect(fieldName).toBe('price');
        expect(input.actual.price).toBe(input.expected.price);
    }
}

export class TextValidationStrategy implements ProductVerificationStrategy {
    async verify(input: ProductVerificationInput, fieldName: keyof ProductVerificationInput['expected']): Promise<void> {
        const actualValue = normalizeString(String(input.actual[fieldName as keyof typeof input.actual]));
        const expectedValue = normalizeString(String(input.expected[fieldName]));

        if (fieldName === 'description') {
            expect(actualValue).toContain(expectedValue);
            return;
        }

        expect(actualValue).toBe(expectedValue);
    }
}

export class ProductVerificationStrategyFactory {
    private readonly priceValidationStrategy = new PriceValidationStrategy();
    private readonly textValidationStrategy = new TextValidationStrategy();

    getStrategy(fieldName: keyof ProductVerificationInput['expected']): ProductVerificationStrategy {
        return fieldName === 'price' ? this.priceValidationStrategy : this.textValidationStrategy;
    }
}
