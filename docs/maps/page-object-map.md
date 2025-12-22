# Page Object Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW CODE!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Page Objects and methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing code instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Page Objects/methods

**ANTI-DUPLICATION RULES:**
- 🔴 **NEVER** create a new Page Object if one exists for the same page
- 🔴 **NEVER** create a new method if similar functionality exists
- 🔴 **NEVER** skip checking this file before coding
- 🟢 **ALWAYS** extend existing Page Objects with new methods
- 🟢 **ALWAYS** reuse existing methods, even if names differ
- 🟢 **ALWAYS** update this map after ANY changes

---

## Existing Page Objects

### WikipediaArticlePage (tests/pages/WikipediaArticlePage.ts)
**URL:** https://test.wikipedia.org/wiki/{title}
**Purpose:** Wikipedia article page for viewing article content

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyArticleTitle() | expectedTitle: string | Promise<void> | Verify article title matches expected text |
| verifyArticleContainsText() | expectedText: string | Promise<void> | Verify article content contains expected text |
| verifyParagraphContainsText() | index: number, expectedText: string | Promise<void> | Verify paragraph at specified index contains expected text |
| getArticleTitle() | - | Promise<string> | Get article title text |
| getArticleContent() | - | Promise<string> | Get full article content text |
| clickEdit() | - | Promise<void> | Click Edit button on the article page |
| verifyPageOpened() | - | Promise<void> | Verify article page is loaded (inherited) |

**Locators:**
- Article title: `#firstHeading`
- Article content: `#mw-content-text`
- Paragraphs: `#mw-content-text .mw-parser-output > p` (dynamic via `getParagraph(index)`)
- Edit button: `role=link[name="Edit"]`

---

### WikipediaMainPage (tests/pages/WikipediaMainPage.ts)
**URL:** https://en.wikipedia.org/wiki/Main_Page
**Purpose:** English Wikipedia main page

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| navigate() | - | Promise<void> | Navigate to Wikipedia main page |
| verifyPageOpened() | - | Promise<void> | Verify main page is loaded (inherited) |

**Locators:**
- Page container: `//div[contains(@class, "ve-init-mw-desktopArticleTarget-targetContainer")]`

---

### WikipediaNavigationMenu (tests/pages/WikipediaNavigationMenu.ts)
**Purpose:** Shared navigation menu component (top right)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| clickDonate() | - | Promise<void> | Click donate link |
| clickLogIn() | - | Promise<void> | Click Log in link |
| clickCreateAccount() | - | Promise<void> | Click Create account link |
| verifyUsernameDisplayed() | expectedUsername: string | Promise<void> | Verify username in menu |
| verifyAlertDisplayed() | - | Promise<void> | Verify alert link is displayed |
| verifyUserLinkDisplayed() | - | Promise<void> | Verify user link is displayed |
| verifyWatchListLinkDisplayed() | - | Promise<void> | Verify watchlist link is displayed |
| verifyNotificationsLinkDisplayed() | - | Promise<void> | Verify notifications link is displayed |
| verifyLogInLinkIsHidden() | - | Promise<void> | Verify log in link is hidden |
| verifyCreateAccountLinkIsHidden() | - | Promise<void> | Verify create account link is hidden |
| verifyLogInLinkDisplayed() | - | Promise<void> | Verify log in link is displayed |
| verifyCreateAccountLinkDisplayed() | - | Promise<void> | Verify create account link is displayed |
| verifyUsernameHidden() | - | Promise<void> | Verify username is hidden (logged out) |
| openPersonalToolsDropdown() | - | Promise<void> | Open Personal tools dropdown |
| verifyLogOutLinkDisplayed() | - | Promise<void> | Verify Log out link is visible and enabled |
| clickLogOut() | - | Promise<void> | Click Log out |
| enterSearchText() | text: string | Promise<void> | Type text into nav search input |
| clickSearch() | - | Promise<void> | Click nav search button |
| getSearchInputValue() | - | Promise<string> | Get nav search input value |
| verifySearchInputIsEmpty() | - | Promise<void> | Verify nav search input is empty |
| openMainMenu() | - | Promise<void> | Open Main Menu sidebar |
| clickCreateNewPageInSidebar() | - | Promise<void> | Click Create a new page in sidebar |

**Locators:**
- Menu container: `#p-personal`
- Donate link: `#pt-sitesupport-2`
- Log in link: `li#pt-login-2 a`
- Create account link: `#pt-createaccount-2`
- Username link: `#pt-userpage-2 span`
- Alert link: `#pt-notifications-alert`
- Watchlist link: `#pt-watchlist-2`
- Notifications link: `#pt-notifications-notice`
- Personal tools dropdown button: `role=button[name="Personal tools"]`
- Log out link: `role=link[name="Log out"]`
- Search input: `#searchInput`
- Search button: `role=button[name="Search"]`
- Main menu button: `role=button[name="Main menu"]`
- Create new page sidebar link: `a[href='/wiki/Wikipedia:Create_a_new_page']`

---

### WikipediaLoginPage (tests/pages/WikipediaLoginPage.ts)
**URL:** https://en.wikipedia.org/w/index.php?title=Special:UserLogin
**Purpose:** Wikipedia login form

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| enterUsername() | username: string | Promise<void> | Enter username |
| enterPassword() | password: string | Promise<void> | Enter password |
| clickLogin() | - | Promise<void> | Click login button |
| verifyLoginPageTitle() | - | Promise<void> | Verify login page title |
| verifyPageOpened() | - | Promise<void> | Verify login page is loaded (inherited) |

**Locators:**
- Username input: `input#wpName1`
- Password input: `input#wpPassword1`
- Login button: `button#wpLoginAttempt`

---

### WikipediaDonatePage (tests/pages/WikipediaDonatePage.ts)
**URL:** Varies (donation campaign URL)
**Purpose:** Donation landing / thank-you page validation

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyThankYouHeaderDisplayed() | - | Promise<void> | Verify thank-you header is visible |
| verifyPageOpened() | - | Promise<void> | Verify donate page is loaded (inherited) |

**Locators:**
- Thank you header: `#Thank_you_for_your_interest`

---

### WikipediaCreatePagePage (tests/pages/WikipediaCreatePagePage.ts)
**URL:** https://test.wikipedia.org/wiki/Wikipedia:Create_a_new_page
**Purpose:** Create a new page screen

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| enterPageTitle() | title: string | Promise<void> | Enter page title into the create page input |
| clickCreateNewPage() | - | Promise<void> | Click Create a new page button |
| verifyPageOpened() | - | Promise<void> | Verify create page is loaded (inherited) |

**Locators:**
- Page title input: `role=textbox`
- Create button: `role=button[name="Create a new page"]`
- Form locator: `role=heading[name="Wikipedia:Create a new page"]`

---

### WikipediaVisualEditorPage (tests/pages/WikipediaVisualEditorPage.ts)
**URL:** Varies (Visual Editor for article editing)
**Purpose:** Visual Editor page for creating/editing articles

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyPageOpened() | - | Promise<void> | Verify Visual Editor page is loaded |
| verifyPublishButtonDisabled() | - | Promise<void> | Verify Publish button is disabled |
| verifyEditorHeaderContainsTitle() | expectedTitle: string | Promise<void> | Verify editor header contains the article title |
| enterContent() | content: string | Promise<void> | Enter content into the editor |
| deleteAndEnterContent() | content: string | Promise<void> | Delete existing content and enter new content |
| clickPublish() | - | Promise<void> | Click Publish button |

**Locators:**
- Editor content: `.ve-ce-branchNode` (first)
- Publish button: `role=button[name=/^Publish/]`
- Editor header: `.ve-init-mw-desktopArticleTarget-originalTitle`
- Form locator: `.ve-init-mw-desktopArticleTarget-targetContainer`

---

### WikipediaSaveChangesDialogPage (tests/pages/WikipediaSaveChangesDialogPage.ts)
**URL:** N/A (Dialog overlay)
**Purpose:** Save your changes dialog

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| verifyPageOpened() | - | Promise<void> | Verify Save your changes dialog is displayed |
| enterEditSummary() | summary: string | Promise<void> | Enter edit summary |
| clickPublish() | - | Promise<void> | Click Publish button in the dialog |

**Locators:**
- Edit summary input: `role=textbox[name=/summary\|description/i]`
- Publish button: `role=button[name=/^Publish/]`
- Form locator: `role=dialog[hasText="Save your changes"]`

---

## Method Naming Conventions

### Actions
- `click*` - Click elements
- `enter*` - Input text
- `select*` - Select from dropdowns
- `navigate*` - Navigate to pages

### Validations
- `verify*` - Complex validations
- `get*` - Retrieve values

---

## Update History

| Date | Page Object | Changes | Updated By |
|------|-------------|---------|------------|
| 2025-01-XX | WikipediaArticlePage | Added clickEdit() method | System |
| 2025-01-XX | WikipediaCreatePagePage | Created new Page Object for create page screen | System |
| 2025-01-XX | WikipediaVisualEditorPage | Created new Page Object for Visual Editor | System |
| 2025-01-XX | WikipediaSaveChangesDialogPage | Created new Page Object for save changes dialog | System |
| 2025-12-22 | WikipediaArticlePage | Created new Page Object for article viewing and assertions | System |
| 2025-01-XX | All | Removed non-existent Page Objects, updated existing ones with actual methods | System |
| 2025-01-XX | WikipediaMainPage | Added navigate() method | System |
| 2025-01-XX | WikipediaLoginPage | Added verifyLoginPageTitle() method | System |
| 2025-01-XX | WikipediaNavigationMenu | Added clickDonate() method | System |
