import { expect, test } from '@fixtures';
import { UserBuilder } from '@utils/builders/UserBuilder';

test.describe('Demoblaze design patterns task', () => {
    test('Sign up, log in, verify product details, and validate cart', async ({
        demoblazeMainSteps,
        demoblazeAuthSteps,
        demoblazeCatalogSteps,
        demoblazeCartSteps,
    }) => {
        const user = new UserBuilder().build();
        const monitorsCategoryName = 'Monitors';
        const productExpectation = {
            name: 'Apple monitor 24',
            price: 400,
            description: 'LED Cinema Display',
        };

        expect(user.username).toContain('dbz_');

        await demoblazeMainSteps.openDirectlyAndVerify();
        await demoblazeAuthSteps.signUp(user);
        await demoblazeAuthSteps.login(user);
        await demoblazeAuthSteps.verifyLoggedInUser(user);
        await demoblazeCatalogSteps.openCategoryProduct(monitorsCategoryName, productExpectation.name);
        await demoblazeCatalogSteps.verifyProductDetails(monitorsCategoryName, productExpectation);
        await demoblazeCatalogSteps.addCurrentProductToCart();
        await demoblazeCatalogSteps.openCart();
        await demoblazeCartSteps.verifyProductInCart(productExpectation);
    });
});
