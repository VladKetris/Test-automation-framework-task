import { faker } from '@faker-js/faker';
import { BaseRequestBuilder } from '@api/builders';
import { DemoblazeUser } from '@sharedTypes/demoblazeTypes';

export class UserBuilder extends BaseRequestBuilder<DemoblazeUser> {
    constructor() {
        super({
            username: `dbz_${faker.string.alphanumeric(10).toLowerCase()}`,
            password: faker.internet.password({ length: 12 }),
            email: faker.internet.email(),
        });
    }

    withUsername(username: string): this {
        return this.with({ username });
    }

    withPassword(password: string): this {
        return this.with({ password });
    }

    withEmail(email: string): this {
        return this.with({ email });
    }

    build(): DemoblazeUser {
        return {
            username: String(this.model.username),
            password: String(this.model.password),
            email: String(this.model.email),
        };
    }
}
