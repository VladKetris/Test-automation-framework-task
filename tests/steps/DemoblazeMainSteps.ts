import { DemoblazeHomePage } from '@pages/DemoblazeHomePage';
import { step } from '@utils/decorators';

export class DemoblazeMainSteps {
    constructor(
        private readonly homePage: DemoblazeHomePage
    ) { }

    @step('Open Demoblaze home page directly and verify')
    async openDirectlyAndVerify(): Promise<void> {
        await this.homePage.navigate();
        await this.homePage.verifyPageOpened();
    }
}
