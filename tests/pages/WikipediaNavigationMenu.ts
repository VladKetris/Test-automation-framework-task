import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WikipediaNavigationMenu extends BasePage {
    private readonly logInLink: Locator;
    private readonly createAccountLink: Locator;
    private readonly usernameLinkLocator: Locator;
    private readonly alertLinkLocator: Locator;
    private readonly watchListLinkLocator: Locator;
    private readonly verifyNotificationsLinkLocator: Locator;
    private readonly personalToolsButton: Locator;
    private readonly logOutLink: Locator;
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly mainMenuCheckbox: Locator;
    private readonly createNewPageSidebarLink: Locator;
    private readonly donateLink: Locator;

    constructor(page: Page) {
        super(page, page.locator('#p-personal'), 'WikipediaNavigationMenu');
        this.logInLink = page.locator('li#pt-login-2 a').describe('Log in link');
        this.createAccountLink = page.locator('#pt-createaccount-2').describe('Create account link');
        this.usernameLinkLocator = page.locator('#pt-userpage-2 span').describe('Username link');
        this.alertLinkLocator = page.locator('#pt-notifications-alert').describe('Alert link');
        this.watchListLinkLocator = page.locator('#pt-watchlist-2').describe('Watchlist link');
        this.verifyNotificationsLinkLocator = page.locator('#pt-notifications-notice').describe('Notifications link');
        this.personalToolsButton = page.getByRole('button', { name: 'Personal tools' }).describe('Personal tools dropdown button');
        this.logOutLink = page.getByRole('link', { name: 'Log out' }).describe('Log out link (user menu)');
        this.searchInput = page.locator('#searchInput').describe('Navigation search input');
        this.searchButton = page.getByRole('button', { name: 'Search' }).describe('Navigation search button');
        this.mainMenuCheckbox = page.getByRole('button', { name: 'Main menu' }).describe('Main menu checkbox');
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
     * Enter search text
     */
    async enterSearchText(text: string): Promise<void> {
        await this.elementToBeVisible(this.searchInput);
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
     * Verify search input is empty
     */
    async verifySearchInputIsEmpty(): Promise<void> {
        await this.elementToHaveValue(this.searchInput, '');
    }

    /**
     * Open main menu
     */
    async openMainMenu(): Promise<void> {
        await this.elementToBeVisible(this.mainMenuCheckbox);
        await this.mainMenuCheckbox.click();
    }

    /**
     * Click create new page link in sidebar
     */
    async clickCreateNewPageInSidebar(): Promise<void> {
        await this.elementToBeVisible(this.createNewPageSidebarLink);
        await this.createNewPageSidebarLink.click();
    }
}

