import { faker } from '@faker-js/faker';

/**
 * Generate a complete random user profile
 * @returns Object containing firstName, lastName, fullName, email, phone, and address
 */
export function generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        address: generateAddress()
    };
}

/**
 * Generate a random address
 * @returns Object containing street, city, state, zipCode, and country
 */
export function generateAddress() {
    return {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
    };
}

/**
 * Generate a random first name
 * @returns Random first name string
 */
export function randomFirstName(): string {
    return faker.person.firstName();
}

/**
 * Generate a random last name
 * @returns Random last name string
 */
export function randomLastName(): string {
    return faker.person.lastName();
}

/**
 * Generate a random full name
 * @returns Random full name string
 */
export function randomFullName(): string {
    return faker.person.fullName();
}

/**
 * Generate a random email address
 * @returns Random email address string
 */
export function randomEmail(): string {
    return faker.internet.email();
}

/**
 * Generate a random mobile number with specified digits
 * @param digits - Number of digits (default: 10)
 * @returns Random mobile number string
 */
export function randomMobileNumber(digits: number = 10): string {
    return faker.string.numeric(digits);
}

/**
 * Generate a random phone number with format
 * @returns Random phone number string
 */
export function randomPhoneNumber(): string {
    return faker.phone.number();
}

/**
 * Generate a random username
 * @returns Random username string
 */
export function randomUsername(): string {
    return faker.internet.username();
}

/**
 * Generate a random password
 * @param length - Password length (default: 12)
 * @returns Random password string
 */
export function randomPassword(length: number = 12): string {
    return faker.internet.password({ length });
}

/**
 * Generate random alphanumeric string
 * @param length - String length (default: 10)
 * @returns Random alphanumeric string
 */
export function randomString(length: number = 10): string {
    return faker.string.alphanumeric(length);
}

/**
 * Generate a random Wikipedia-safe article title.
 *
 * - **pageTitle**: Uses underscores (no spaces) to avoid URL encoding and UI formatting issues.
 * - **headerTitle**: UI heading variant (underscores replaced with spaces).
 * @param prefix - Prefix for the article title (default: 'AutoArticle')
 * @returns Object containing pageTitle and headerTitle
 */
export function createArticleTitle(prefix: string = 'AutoArticle'): { pageTitle: string; headerTitle: string } {
    const pageTitle = `${prefix}_${randomString()}`;
    const headerTitle = pageTitle.replace(/_/g, ' ');
    return { pageTitle, headerTitle };
}

/**
 * Generate a random sentence
 * @param wordCount - Number of words (default: 5)
 * @returns Random sentence string
 */
export function randomSentence(wordCount: number = 5): string {
    return faker.lorem.sentence(wordCount);
}

/**
 * Generate random paragraph
 * @returns Random paragraph string
 */
export function randomParagraph(): string {
    return faker.lorem.paragraph();
}

/**
 * Generate random integer within range
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (default: 1000)
 * @returns Random integer number
 */
export function randomNumber(min: number = 0, max: number = 1000): number {
    return faker.number.int({ min, max });
}

/**
 * Generate random decimal number
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (default: 1000)
 * @param precision - Decimal places (default: 2)
 * @returns Random decimal number
 */
export function randomDecimal(min: number = 0, max: number = 1000, precision: number = 2): number {
    return faker.number.float({ min, max, fractionDigits: precision });
}

/**
 * Generate random past date
 * @param years - Number of years in the past (default: 1)
 * @returns Random past date
 */
export function randomPastDate(years: number = 1): Date {
    return faker.date.past({ years });
}

/**
 * Generate random future date
 * @param years - Number of years in the future (default: 1)
 * @returns Random future date
 */
export function randomFutureDate(years: number = 1): Date {
    return faker.date.future({ years });
}

/**
 * Generate random birthdate
 * @param minAge - Minimum age (default: 18)
 * @param maxAge - Maximum age (default: 65)
 * @returns Random birthdate
 */
export function randomBirthdate(minAge: number = 18, maxAge: number = 65): Date {
    return faker.date.birthdate({ min: minAge, max: maxAge, mode: 'age' });
}

/**
 * Generate random URL
 * @returns Random URL string
 */
export function randomUrl(): string {
    return faker.internet.url();
}

/**
 * Generate random company name
 * @returns Random company name string
 */
export function randomCompanyName(): string {
    return faker.company.name();
}

/**
 * Generate a random edit summary/description for API operations
 * @param prefix - Optional prefix for the summary (default: 'Automated test')
 * @returns Random edit summary string
 */
export function randomEditSummary(prefix: string = 'Automated test'): string {
    return `${prefix} ${randomString()}`;
}

