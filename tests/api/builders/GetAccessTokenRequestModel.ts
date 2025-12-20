import { BaseRequestBuilder } from "@api/builders/BaseRequestBuilder";
import { getMetaApiCredentials } from "@utils/secrets";
import { GrantType } from "@api/constants";

export type GetAccessTokenRequest = {
    grant_type: string;
    client_id: string;
    client_secret: string;
}

export class GetAccessTokenRequestModel extends BaseRequestBuilder<GetAccessTokenRequest> {
    constructor() {
        super();
    }

    static buildMetaUserRequestModel(): Partial<GetAccessTokenRequest> {
        const { clientId, clientSecret } = getMetaApiCredentials();
        return new GetAccessTokenRequestModel()
            .with({
                grant_type: GrantType.CLIENT_CREDENTIALS,
                client_id: clientId,
                client_secret: clientSecret
            }).build();
    }
}