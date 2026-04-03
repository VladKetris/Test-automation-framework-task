import { Page } from '@playwright/test';
import { DemoblazeCartPage } from '@pages/DemoblazeCartPage';
import { DemoblazeHomePage } from '@pages/DemoblazeHomePage';
import { DemoblazeLoginModalPage } from '@pages/DemoblazeLoginModalPage';
import { DemoblazeProductPage } from '@pages/DemoblazeProductPage';
import { DemoblazeSignUpModalPage } from '@pages/DemoblazeSignUpModalPage';

export type SupportedPageName =
    | 'demoblaze-home'
    | 'demoblaze-signup-modal'
    | 'demoblaze-login-modal'
    | 'demoblaze-product'
    | 'demoblaze-cart';

export class PageFactory {
    static create<T>(page: Page, pageName: SupportedPageName): T {
        switch (pageName) {
            case 'demoblaze-home':
                return new DemoblazeHomePage(page) as T;
            case 'demoblaze-signup-modal':
                return new DemoblazeSignUpModalPage(page) as T;
            case 'demoblaze-login-modal':
                return new DemoblazeLoginModalPage(page) as T;
            case 'demoblaze-product':
                return new DemoblazeProductPage(page) as T;
            case 'demoblaze-cart':
                return new DemoblazeCartPage(page) as T;
            default:
                throw new Error(`Unsupported page object requested: ${pageName}`);
        }
    }
}
