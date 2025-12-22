import { BaseRequestBuilder } from "@api/builders/BaseRequestBuilder";
import { MediaWikiEditOption } from "@api/constants";

export type CreatePageRequest = {
    title: string;
    text: string;
    token: string;
    summary: string;
    createonly: string;
}

export class CreatePageRequestModel extends BaseRequestBuilder<CreatePageRequest> {
    constructor() {
        super();
    }

    static buildCreatePageRequestModel(
        title: string,
        content: string,
        csrfToken: string,
        summary?: string
    ): Partial<CreatePageRequest> {
        return new CreatePageRequestModel()
            .with({
                title,
                text: content,
                token: csrfToken,
                summary: summary ?? 'Automated test page creation',
                createonly: MediaWikiEditOption.CREATE_ONLY
            }).build();
    }
}

