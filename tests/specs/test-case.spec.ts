import { test } from '@fixtures';
import { generateRandomUser } from '@utils/test-data-generator';

test.describe('Web+UI Test automation task', () => {

    test('Execute automation task scenario', async ({
        testApiSteps,
        testMainSteps,
        testNavigationMenuPage,
        testLoginSteps,
        testProductsSteps,
        testAddedToCartPopupSteps,
        testViewCartSteps,
    }) => {
        const testUser = generateRandomUser();
        const { email, password } = testUser;
        await testApiSteps.registerNewUser(testUser);

        await testMainSteps.openDirectlyAndVerify();

        await testNavigationMenuPage.clickLogIn();

        await testLoginSteps.login({ email, password });

        await testNavigationMenuPage.verifyUserLoggedIn();
        await testNavigationMenuPage.clickProducts();

        await testProductsSteps.verifyPageOpened();

        const firstProduct = await testProductsSteps.getProductCartDetailsByIndex(0);
        const secondProduct = await testProductsSteps.getProductCartDetailsByIndex(1);

        await testProductsSteps.addProductToCartByIndex(0);
        await testAddedToCartPopupSteps.continueShopping();

        await testProductsSteps.addProductToCartByIndex(1);
        await testAddedToCartPopupSteps.openCart();

        await testViewCartSteps.verifyProductsInCart([firstProduct, secondProduct]);

        await testApiSteps.deleteUser({ email, password });
    });

});

