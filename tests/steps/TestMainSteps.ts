import { TestMainPage } from '@pages/TestMainPage';
import { step } from '@utils/decorators';

export class TestMainSteps {
    constructor(
        readonly mainPage: TestMainPage
    ) { }

    @step('Open Test main page directly and verify')
    async openDirectlyAndVerify(): Promise<void> {
        await this.mainPage.navigate();
        await this.mainPage.verifyPageOpened();
    }

    @step('Verify Test main page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.mainPage.verifyPageOpened();
    }
}
