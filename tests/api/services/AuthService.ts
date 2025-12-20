import { APIResponse } from '@playwright/test';
import { ApiClient } from '@utils/api-client';
import { AuthRoutes } from '@api/routes';
import { GetAccessTokenRequestModel, GetAccessTokenRequest } from '@api/builders';

export class AuthService {
    constructor(private readonly client: ApiClient) { }

    async getMetaUserAccessToken(): Promise<APIResponse> {
        return this.getAccessToken(GetAccessTokenRequestModel.buildMetaUserRequestModel());
    }

    private async getAccessToken(requestBody: Partial<GetAccessTokenRequest>): Promise<APIResponse> {
        return this.client.post(AuthRoutes.AUTH, {
            form: requestBody
        });
    }
}
