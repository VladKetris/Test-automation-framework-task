import { WikipediaMainPage } from '@pages/WikipediaMainPage';
import { step } from '@utils/decorators';

export class WikipediaMainSteps {
    constructor(
        readonly mainPage: WikipediaMainPage
    ) { }

    @step('Open Wikipedia main page directly and verify')
    async openDirectlyAndVerify(): Promise<void> {
        await this.mainPage.navigate();
        await this.mainPage.verifyPageOpened();
    }

    @step('Verify Wikipedia main page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.mainPage.verifyPageOpened();
    }
}
