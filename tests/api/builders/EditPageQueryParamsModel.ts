import { BaseRequestBuilder } from "@api/builders/BaseRequestBuilder";
import { MediaWikiAction, MediaWikiFormat } from "@api/constants";

export type EditPageQueryParams = {
    action: string;
    format: string;
}

export class EditPageQueryParamsModel extends BaseRequestBuilder<EditPageQueryParams> {
    constructor() {
        super();
    }

    static buildQueryParams(): Partial<EditPageQueryParams> {
        return new EditPageQueryParamsModel()
            .with({
                action: MediaWikiAction.EDIT,
                format: MediaWikiFormat.JSON
            }).build();
    }
}

