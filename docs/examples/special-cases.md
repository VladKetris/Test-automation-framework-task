# Special Cases

Handling complex UI elements in Playwright with TypeScript.

**📘 Related:** [page-object.md](../patterns/page-object.md) | [elements.md](../patterns/elements.md)

---

## Working with Tables

Use Playwright's table locators to extract structured data.

### Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaContributorsPage extends BasePage {
    private readonly contributorsTable: Locator;
    private readonly tableRows: Locator;
    private readonly tableHeaders: Locator;

    // Dynamic locators as arrow functions
    private readonly getRowCells = (rowIndex: number): Locator => 
        this.tableRows.nth(rowIndex).locator('td');
    
    private readonly getCell = (rowIndex: number, columnIndex: number): Locator => 
        this.getRowCells(rowIndex).nth(columnIndex);
    
    private readonly getCellLink = (rowIndex: number, columnIndex: number): Locator => 
        this.getCell(rowIndex, columnIndex).locator('a');

    constructor(page: Page) {
        super(page, page.locator('#mw-content-text table'), 'WikipediaContributorsPage');
        
        this.contributorsTable = page.locator('#mw-content-text table.wikitable')
            .describe('Contributors table');
        this.tableRows = this.contributorsTable.locator('tbody tr')
            .describe('Table rows');
        this.tableHeaders = this.contributorsTable.locator('thead th, tr:first-child th')
            .describe('Table headers');
    }

    /**
     * Get all table data as array of objects
     */
    async getAllTableData(): Promise<Record<string, string>[]> {
        const headers = await this.tableHeaders.allTextContents();
        const rowCount = await this.tableRows.count();
        const tableData: Record<string, string>[] = [];

        for (let i = 0; i < rowCount; i++) {
            const cells = await this.getRowCells(i).allTextContents();
            const rowData: Record<string, string> = {};
            
            headers.forEach((header, index) => {
                rowData[header.trim()] = cells[index]?.trim() || '';
            });
            
            tableData.push(rowData);
        }

        return tableData;
    }

    /**
     * Get row count
     */
    async getRowCount(): Promise<number> {
        return this.tableRows.count();
    }

    /**
     * Get cell value by row and column index
     */
    async getCellValue(rowIndex: number, columnIndex: number): Promise<string> {
        const cell = this.getCell(rowIndex, columnIndex);
        await this.elementToBeVisible(cell);
        const text = await cell.textContent();
        return text || '';
    }

    /**
     * Click link in specific cell
     */
    async clickCellLink(rowIndex: number, columnIndex: number): Promise<void> {
        const link = this.getCellLink(rowIndex, columnIndex);
        await this.elementToBeVisible(link);
        await link.click();
    }

    /**
     * Verify table is visible
     */
    async verifyTableVisible(): Promise<void> {
        await this.elementToBeVisible(this.contributorsTable);
    }

    /**
     * Verify row count
     */
    async verifyRowCount(expectedCount: number): Promise<void> {
        const count = await this.getRowCount();
        if (count !== expectedCount) {
            throw new Error(`Expected ${expectedCount} rows, but found ${count}`);
        }
    }
}
```

### Usage in Test

```typescript
import { test, expect } from '@fixtures';

test('Verify contributors table data', async ({ wikipediaContributorsPage }) => {
    await wikipediaContributorsPage.verifyTableVisible();
    
    const data = await wikipediaContributorsPage.getAllTableData();
    expect(data.length).toBeGreaterThan(0);
    
    const firstRow = data[0];
    expect(firstRow['Username']).toBeDefined();
});
```

---

## IFrame Handling

Use Playwright's `FrameLocator` to interact with iframe content.

### Page Object

```typescript
import { Page, Locator, FrameLocator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaDonateIframePage extends BasePage {
    private readonly donationFrame: FrameLocator;
    private readonly amountInput: Locator;
    private readonly currencySelect: Locator;
    private readonly submitButton: Locator;

    constructor(page: Page) {
        super(page, page.locator('#donate-form-container'), 'WikipediaDonateIframePage');
        
        // Define the frame locator (FrameLocator doesn't support .describe())
        this.donationFrame = page.frameLocator('#donation-iframe');
        
        // Define elements INSIDE the frame with .describe()
        this.amountInput = this.donationFrame.locator('#amount-input')
            .describe('Donation amount input');
        this.currencySelect = this.donationFrame.locator('#currency-select')
            .describe('Currency selector');
        this.submitButton = this.donationFrame.locator('button[type="submit"]')
            .describe('Submit donation button');
    }

    /**
     * Enter donation amount
     */
    async enterAmount(amount: string): Promise<void> {
        await this.amountInput.fill(amount);
    }

    /**
     * Select currency
     */
    async selectCurrency(currency: string): Promise<void> {
        await this.currencySelect.selectOption(currency);
    }

    /**
     * Click submit button
     */
    async clickSubmit(): Promise<void> {
        await this.submitButton.click();
    }

    /**
     * Get current amount value
     */
    async getAmountValue(): Promise<string> {
        return this.amountInput.inputValue();
    }

    /**
     * Verify amount input is visible
     */
    async verifyAmountInputVisible(): Promise<void> {
        await this.amountInput.waitFor({ state: 'visible' });
    }
}
```

### Key Points for IFrames

```typescript
// ✅ CORRECT: Chain locators from FrameLocator
this.element = this.frame.locator('#element-id').describe('Element');

// ❌ WRONG: Don't use page.locator for iframe content
this.element = page.locator('#element-id');  // Won't find element in iframe

// ✅ CORRECT: Nested iframes
const outerFrame = page.frameLocator('#outer-iframe');
const innerFrame = outerFrame.frameLocator('#inner-iframe');
this.element = innerFrame.locator('#element');
```

---

## Browser Alerts (Dialogs)

Playwright handles dialogs via event listeners. Set up listener BEFORE the action that triggers the dialog.

### Page Object Methods

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaArticlePage extends BasePage {
    private readonly deleteButton: Locator;
    private readonly confirmDeleteButton: Locator;

    constructor(page: Page) {
        super(page, page.locator('#mw-content-text'), 'WikipediaArticlePage');
        
        this.deleteButton = page.locator('#ca-delete')
            .describe('Delete article button');
        this.confirmDeleteButton = page.locator('#wpConfirmB')
            .describe('Confirm delete button');
    }

    /**
     * Accept browser alert and click delete
     */
    async deleteWithConfirmation(): Promise<void> {
        // Setup listener BEFORE the action that triggers dialog
        this.page.once('dialog', dialog => dialog.accept());
        await this.deleteButton.click();
    }

    /**
     * Dismiss browser alert
     */
    async cancelDelete(): Promise<void> {
        this.page.once('dialog', dialog => dialog.dismiss());
        await this.deleteButton.click();
    }

    /**
     * Handle alert with custom response
     */
    async handlePromptDialog(response: string): Promise<void> {
        this.page.once('dialog', dialog => dialog.accept(response));
        await this.deleteButton.click();
    }
}
```

### Dialog Types

| Type | Method | Description |
|------|--------|-------------|
| `alert` | `dialog.accept()` | Simple OK button |
| `confirm` | `dialog.accept()` / `dialog.dismiss()` | OK or Cancel |
| `prompt` | `dialog.accept(text)` | Input with OK/Cancel |
| `beforeunload` | `dialog.accept()` | Page leave confirmation |

### Verifying Dialog Message

```typescript
import { expect } from '@playwright/test';

/**
 * Delete with message verification
 */
async deleteWithMessageVerification(expectedMessage: string): Promise<void> {
    let dialogMessage = '';
    
    this.page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.accept();
    });
    
    await this.deleteButton.click();
    
    // Verify after dialog is handled
    expect(dialogMessage).toBe(expectedMessage);
}
```

---

## File Upload

Handle file uploads with Playwright's `setInputFiles`.

### Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaUploadPage extends BasePage {
    private readonly fileInput: Locator;
    private readonly uploadButton: Locator;
    private readonly fileNameDisplay: Locator;

    constructor(page: Page) {
        super(page, page.locator('#mw-upload-form'), 'WikipediaUploadPage');
        
        this.fileInput = page.locator('input[type="file"]')
            .describe('File input');
        this.uploadButton = page.locator('#wpUpload')
            .describe('Upload button');
        this.fileNameDisplay = page.locator('.mw-upload-filename')
            .describe('Uploaded file name');
    }

    /**
     * Upload single file
     */
    async uploadFile(filePath: string): Promise<void> {
        await this.fileInput.setInputFiles(filePath);
    }

    /**
     * Upload multiple files
     */
    async uploadMultipleFiles(filePaths: string[]): Promise<void> {
        await this.fileInput.setInputFiles(filePaths);
    }

    /**
     * Clear file selection
     */
    async clearFileSelection(): Promise<void> {
        await this.fileInput.setInputFiles([]);
    }

    /**
     * Click upload button
     */
    async clickUpload(): Promise<void> {
        await this.elementToBeVisible(this.uploadButton);
        await this.uploadButton.click();
    }

    /**
     * Verify file name displayed
     */
    async verifyFileNameDisplayed(expectedName: string): Promise<void> {
        await this.elementToContainText(this.fileNameDisplay, expectedName);
    }
}
```

---

## File Download

Handle file downloads with Playwright's download events.

### Page Object

```typescript
import { Page, Locator, Download } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaExportPage extends BasePage {
    private readonly exportButton: Locator;
    private readonly formatSelect: Locator;

    constructor(page: Page) {
        super(page, page.locator('#mw-export'), 'WikipediaExportPage');
        
        this.exportButton = page.locator('#wpExport')
            .describe('Export button');
        this.formatSelect = page.locator('#wpFormat')
            .describe('Export format selector');
    }

    /**
     * Download file and return Download object
     */
    async downloadExport(): Promise<Download> {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.exportButton.click()
        ]);
        return download;
    }

    /**
     * Download and save to specific path
     */
    async downloadExportToPath(savePath: string): Promise<void> {
        const download = await this.downloadExport();
        await download.saveAs(savePath);
    }

    /**
     * Get downloaded file name
     */
    async getDownloadedFileName(): Promise<string> {
        const download = await this.downloadExport();
        return download.suggestedFilename();
    }
}
```

---

## Drag and Drop

Handle drag and drop interactions.

### Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaReorderPage extends BasePage {
    private readonly draggableItems: Locator;
    private readonly dropZone: Locator;

    // Dynamic locator for specific item by index
    private readonly getDraggableItem = (index: number): Locator => 
        this.draggableItems.nth(index);

    constructor(page: Page) {
        super(page, page.locator('#reorder-container'), 'WikipediaReorderPage');
        
        this.draggableItems = page.locator('.draggable-item')
            .describe('Draggable items');
        this.dropZone = page.locator('#drop-zone')
            .describe('Drop zone');
    }

    /**
     * Drag item to drop zone
     */
    async dragItemToZone(itemIndex: number): Promise<void> {
        await this.getDraggableItem(itemIndex).dragTo(this.dropZone);
    }

    /**
     * Drag item to specific position
     */
    async dragItemToPosition(itemIndex: number, targetIndex: number): Promise<void> {
        await this.getDraggableItem(itemIndex).dragTo(this.getDraggableItem(targetIndex));
    }

    /**
     * Get item order
     */
    async getItemOrder(): Promise<string[]> {
        return this.draggableItems.allTextContents();
    }
}
```

---

## Hover and Tooltips

Handle hover states and verify tooltips.

### Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class WikipediaInfoPage extends BasePage {
    private readonly infoIcon: Locator;
    private readonly tooltip: Locator;

    constructor(page: Page) {
        super(page, page.locator('#mw-content-text'), 'WikipediaInfoPage');
        
        this.infoIcon = page.locator('.info-icon')
            .describe('Info icon');
        this.tooltip = page.locator('.tooltip-content')
            .describe('Tooltip content');
    }

    /**
     * Hover over info icon
     */
    async hoverInfoIcon(): Promise<void> {
        await this.infoIcon.hover();
    }

    /**
     * Verify tooltip is visible after hover
     */
    async verifyTooltipVisible(): Promise<void> {
        await this.hoverInfoIcon();
        await this.elementToBeVisible(this.tooltip);
    }

    /**
     * Verify tooltip text
     */
    async verifyTooltipText(expectedText: string): Promise<void> {
        await this.hoverInfoIcon();
        await this.elementToContainText(this.tooltip, expectedText);
    }
}
```

---

## Dynamic Locators Pattern

For locators that depend on parameters (index, text, etc.), use **arrow functions** defined as class properties:

```typescript
export class TablePage extends BasePage {
    private readonly rows: Locator;
    
    // ✅ GOOD: Arrow function for dynamic locator
    private readonly getRow = (index: number): Locator => 
        this.rows.nth(index);
    
    private readonly getCell = (row: number, col: number): Locator => 
        this.getRow(row).locator('td').nth(col);

    constructor(page: Page) {
        super(page, page.locator('table'), 'TablePage');
        this.rows = page.locator('tbody tr').describe('Table rows');
    }

    async clickCell(row: number, col: number): Promise<void> {
        // ✅ GOOD: Use class-level dynamic locator
        await this.getCell(row, col).click();
    }
}
```

**❌ Avoid inline locator creation in methods:**
```typescript
// ❌ BAD: Creating locator inline
async clickCell(row: number, col: number): Promise<void> {
    const cell = this.rows.nth(row).locator('td').nth(col);
    await cell.click();
}
```

---

## Best Practices Summary

| Pattern | Key Points |
|---------|------------|
| **Tables** | Use arrow functions for row/cell access, `allTextContents()` for bulk |
| **IFrames** | Chain from `FrameLocator`, not `page.locator()` |
| **Dialogs** | Set listener BEFORE triggering action |
| **File Upload** | Use `setInputFiles()` with path or array |
| **File Download** | Use `waitForEvent('download')` with Promise.all |
| **Drag & Drop** | Use `dragTo()` method with dynamic locators |
| **Hover** | Use `hover()` then verify tooltip |

### Conventions Checklist

- ✅ `private readonly` for all locators
- ✅ `.describe()` on all Locator elements
- ✅ Arrow functions for dynamic/parameterized locators
- ✅ JSDoc on all public methods
- ✅ Path aliases (`@pages`, `@utils`)
- ✅ BasePage methods for assertions
- ✅ Atomic actions in Page Objects

---

**📘 See also:**
- [page-object.md](../patterns/page-object.md) - Page Object rules
- [elements.md](../patterns/elements.md) - Element handling patterns
- [locators.md](../patterns/locators.md) - Locator extraction methodology
