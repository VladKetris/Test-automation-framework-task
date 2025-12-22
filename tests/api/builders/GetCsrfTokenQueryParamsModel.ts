import { BaseRequestBuilder } from "@api/builders/BaseRequestBuilder";
import { MediaWikiAction, MediaWikiFormat, MediaWikiMeta, MediaWikiTokenType } from "@api/constants";

export type GetCsrfTokenQueryParams = {
    action: string;
    meta: string;
    type: string;
    format: string;
}

export class GetCsrfTokenQueryParamsModel extends BaseRequestBuilder<GetCsrfTokenQueryParams> {
    constructor() {
        super();
    }

    static buildQueryParams(): Partial<GetCsrfTokenQueryParams> {
        return new GetCsrfTokenQueryParamsModel()
            .with({
                action: MediaWikiAction.QUERY,
                meta: MediaWikiMeta.TOKENS,
                type: MediaWikiTokenType.CSRF,
                format: MediaWikiFormat.JSON
            }).build();
    }
}

