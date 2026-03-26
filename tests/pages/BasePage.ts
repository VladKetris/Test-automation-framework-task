import { expect, Locator, Page } from '@playwright/test';
import { getEnvironment } from '@utils/config';

export class BasePage {
    protected readonly name: string;
    protected readonly defaultTimeout: number;

    constructor(
        protected readonly page: Page,
        protected readonly formLocator: Locator,
        name: string
    ) {
        this.name = name;
        this.defaultTimeout = getEnvironment().timeouts.assertion;
    }

    protected async elementToBeVisible(element: Locator, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should be displayed`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toBeVisible({ timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToBeHidden(element: Locator, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should be hidden`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toBeHidden({ timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToBeDisabled(element: Locator, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should be disabled`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toBeDisabled({ timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToBeEnabled(element: Locator, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should be enabled`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toBeEnabled({ timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToBeChecked(element: Locator, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should be checked`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toBeChecked({ timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToHaveCss(element: Locator, cssProperty: string, expectedValue: string, useSoftAssertions: boolean = true, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should have CSS property ${cssProperty} with value ${expectedValue}`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toHaveCSS(cssProperty, expectedValue, { timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToHaveText(element: Locator, text: string, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should have text ${text}`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toHaveText(text, { timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToContainText(element: Locator, text: string, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should contain text ${text}`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toContainText(text, { timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToHaveAttribute(element: Locator, attribute: string, expectedValue: string, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should have attribute ${attribute} with value ${expectedValue}`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toHaveAttribute(attribute, expectedValue, { timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async elementToHaveValue(element: Locator, expectedValue: string, useSoftAssertions: boolean = false, timeout?: number): Promise<Locator> {
        const message = `${this.name} :: element ${element} should have value "${expectedValue}"`;
        await (useSoftAssertions ? expect.soft : expect)(element, { message: message }).toHaveValue(expectedValue, { timeout: timeout ?? this.defaultTimeout });
        return element;
    }

    protected async isLocatorVisible(locator: Locator): Promise<boolean> {
        try {
            return await locator.isVisible();
        } catch {
            return false;
        }
    }

    /**
     * Wait for a callback to return a non-null value without failing when the value never appears.
     * @param callback - Function that returns the expected value or null while it is unavailable
     * @param timeout - Maximum wait time in milliseconds
     * @returns The first non-null value returned by the callback, or null when it never appears
     */
    protected async waitForValue<T>(callback: () => Promise<T | null>, timeout?: number): Promise<T | null> {
        const state: { value: T | null } = { value: null };

        try {
            await expect(async () => {
                state.value = await callback();
                expect(state.value).not.toBeNull();
            }).toPass({ timeout: timeout ?? this.defaultTimeout });
        } catch {
            return null;
        }

        return state.value;
    }

    async verifyPageOpened(useSoftAssertions: boolean = false, timeout?: number): Promise<void> {
        const message = `${this.name} :: page should be opened`;
        await (useSoftAssertions ? expect.soft : expect)(this.formLocator, { message: message }).toBeVisible({ timeout: timeout ?? getEnvironment().timeouts.pageLoad });
    }

    async verifyPageTitle(title: string | RegExp, useSoftAssertions: boolean = false, timeout?: number): Promise<void> {
        const message = `${this.name} :: page title should match "${title}"`;
        await (useSoftAssertions ? expect.soft : expect)(this.page, { message: message }).toHaveTitle(title, { timeout: timeout ?? this.defaultTimeout });
    }
}