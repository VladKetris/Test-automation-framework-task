import { WikipediaVisualEditorPage } from '@pages/WikipediaVisualEditorPage';
import { WikipediaSaveChangesDialogPage } from '@pages/WikipediaSaveChangesDialogPage';
import { step } from '@utils/decorators';

export class WikipediaArticleEditSteps {
    constructor(
        private readonly visualEditorPage: WikipediaVisualEditorPage,
        private readonly saveChangesDialogPage: WikipediaSaveChangesDialogPage
    ) {}

    @step('Edit article content and publish with new content "{0}"')
    async editContentAndPublish(newContent: string): Promise<void> {
        await this.visualEditorPage.verifyPageOpened();
        await this.visualEditorPage.replaceContentWith(newContent);
        await this.visualEditorPage.clickPublish();
    }

    @step('Save changes with edit summary "{0}"')
    async saveChangesWithSummary(editSummary: string): Promise<void> {
        await this.saveChangesDialogPage.verifyPageOpened();
        await this.saveChangesDialogPage.enterEditSummary(editSummary);
        await this.saveChangesDialogPage.clickPublish();
    }
}

