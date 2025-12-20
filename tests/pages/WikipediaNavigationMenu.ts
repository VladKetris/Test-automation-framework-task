import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaNavigationMenu extends BasePage {
    private readonly logInLink: Locator;
    private readonly createAccountLink: Locator;
    private readonly usernameLinkLocator: Locator;
    private readonly alertLinkLocator: Locator;
    private readonly userMenuLinkLocator: Locator;
    private readonly watchListLinkLocator: Locator;
    private readonly verifyNotificationsLinkLocator: Locator;
    private readonly personalToolsButton: Locator;
    private readonly logOutLink: Locator;
    private readonly searchToggleLink: Locator;
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly mainMenuCheckbox: Locator;
    private readonly hideMainMenuLink: Locator;
    private readonly createNewPageSidebarLink: Locator;
    private readonly donateLink: Locator;

    constructor(page: Page) {
        super(page, page.locator('#p-personal'), 'WikipediaNavigationMenu');
        this.logInLink = page.locator('li#pt-login-2 a').describe('Log in link');
        this.createAccountLink = page.locator('#pt-createaccount-2').describe('Create account link');
        this.usernameLinkLocator = page.locator('#pt-userpage-2 span').describe('Username link');
        this.alertLinkLocator = page.locator('#pt-notifications-alert').describe('Alert link');
        this.userMenuLinkLocator = page.locator('#pt-userpage-2 span').describe('User menu link');
        this.watchListLinkLocator = page.locator('#pt-watchlist-2').describe('Watchlist link');
        this.verifyNotificationsLinkLocator = page.locator('#pt-notifications-notice').describe('Notifications link');
        this.personalToolsButton = page.getByRole('button', { name: 'Personal tools' }).describe('Personal tools dropdown button');
        this.logOutLink = page.getByRole('link', { name: 'Log out' }).describe('Log out link (user menu)');
        this.searchToggleLink = page.getByRole('link', { name: 'Search' }).describe('Search toggle link');
        this.searchInput = page.locator('#searchInput').describe('Navigation search input');
        this.searchButton = page.locator('form#searchform button.cdx-search-input__end-button').describe('Navigation search button');
        this.mainMenuCheckbox = page.locator('#vector-main-menu-dropdown-checkbox').describe('Main menu checkbox');
        this.hideMainMenuLink = page.locator('//button[@data-event-name="pinnable-header.vector-main-menu.unpin"]').describe('Hide main menu link');
        this.createNewPageSidebarLink = page.locator("a[href='/wiki/Wikipedia:Create_a_new_page']").describe('Create a new page sidebar link');
        this.donateLink = page.locator('#pt-sitesupport-2').describe('Donate link');
    }

    /**
     * Click donate link
     */
    async clickDonate(): Promise<void> {
        await this.donateLink.click();
    }

    /**
     * Click log in link
     */
    async clickLogIn(): Promise<void> {
        await this.logInLink.click();
    }

    /**
     * Click create account link
     */
    async clickCreateAccount(): Promise<void> {
        await this.createAccountLink.click();
    }

    /**
     * Verify username is displayed with expected text
     */
    async verifyUsernameDisplayed(expectedUsername: string): Promise<void> {
        await this.elementToBeVisible(this.usernameLinkLocator);
        await this.elementToHaveText(this.usernameLinkLocator, expectedUsername);
    }

    /**
     * Verify alert link is displayed
     */
    async verifyAlertDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.alertLinkLocator);
    }

    /**
     * Verify user link is displayed
     */
    async verifyUserLinkDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.usernameLinkLocator);
    }

    /**
     * Verify user menu link is displayed
     */
    async verifyUserMenuLinkDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.userMenuLinkLocator);
    }

    /**
     * Verify watchlist link is displayed
     */
    async verifyWatchListLinkDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.watchListLinkLocator);
    }

    /**
     * Verify notifications link is displayed
     */
    async verifyNotificationsLinkDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.verifyNotificationsLinkLocator);
    }

    /**
     * Verify log in link is hidden
     */
    async verifyLogInLinkIsHidden(): Promise<void> {
        await this.elementToBeHidden(this.logInLink);
    }

    /**
     * Verify create account link is hidden
     */
    async verifyCreateAccountLinkIsHidden(): Promise<void> {
        await this.elementToBeHidden(this.createAccountLink);
    }

    /**
     * Verify log in link is displayed
     */
    async verifyLogInLinkDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.logInLink);
    }

    /**
     * Verify create account link is displayed
     */
    async verifyCreateAccountLinkDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.createAccountLink);
    }

    /**
     * Verify username is hidden
     */
    async verifyUsernameHidden(): Promise<void> {
        await this.elementToBeHidden(this.usernameLinkLocator);
    }

    /**
     * Open personal tools dropdown
     */
    async openPersonalToolsDropdown(): Promise<void> {
        await this.personalToolsButton.click();
    }

    /**
     * Verify log out link is displayed and enabled
     */
    async verifyLogOutLinkDisplayed(): Promise<void> {
        await this.elementToBeVisible(this.logOutLink);
        await this.elementToBeEnabled(this.logOutLink);
    }

    /**
     * Click log out link
     */
    async clickLogOut(): Promise<void> {
        await this.elementToBeVisible(this.logOutLink);
        await this.logOutLink.click();
    }

    /**
     * Open search if needed
     */
    private async openSearchIfNeeded(): Promise<void> {
        if (await this.searchInput.isVisible()) {
            return;
        }

        await this.elementToBeVisible(this.searchToggleLink);
        await this.searchToggleLink.click();
        await this.elementToBeVisible(this.searchInput);
    }

    /**
     * Enter search text
     */
    async enterSearchText(text: string): Promise<void> {
        await this.openSearchIfNeeded();
        await this.searchInput.fill(text);
    }

    /**
     * Click search button
     */
    async clickSearch(): Promise<void> {
        await this.elementToBeVisible(this.searchButton);
        await this.searchButton.click();
    }

    /**
     * Get search input value
     */
    async getSearchInputValue(): Promise<string> {
        return this.searchInput.inputValue();
    }

    /**
     * Verify search input is empty
     */
    async verifySearchInputIsEmpty(): Promise<void> {
        await this.elementToHaveValue(this.searchInput, '');
    }

    /**
     * Open main menu
     */
    async openMainMenu(): Promise<void> {
        if(await this.hideMainMenuLink.isHidden()) {
            await this.mainMenuCheckbox.click();
        }
    }

    /**
     * Click create new page link in sidebar
     */
    async clickCreateNewPageInSidebar(): Promise<void> {
        await this.createNewPageSidebarLink.click();
    }
}

