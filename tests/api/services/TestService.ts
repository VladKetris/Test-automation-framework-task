import { APIResponse } from '@playwright/test';
import { ApiClient } from '@utils/api-client';
import { TestApiRoutes } from '@api/routes';
import { CreateTestUserPayload, TestUserCredentials } from '@api/schemas/TestSchema';

export class TestService {
    constructor(
        private readonly client: ApiClient,
    ) { }

    /**
     * Post method to create new user
     * @returns Raw API response containing status and message
     */
    async registerNewUser(requestBody: CreateTestUserPayload): Promise<APIResponse> {
        return this.client.post(TestApiRoutes.CREATE_USER, {
            form: requestBody,
        });
    }

    /**
     * Delete method to delete user
     * @returns Raw API response containing status and message
     */
    async deleteUser(requestBody: TestUserCredentials): Promise<APIResponse> {
      return this.client.delete(TestApiRoutes.DELETE_USER, {
        form: requestBody,
      });
    }

    /**
     * Get user details by email
     * @returns Raw API response containing status and user object
     */
    async getUserDetails(email: string): Promise<APIResponse> {
      return this.client.get(TestApiRoutes.GET_USER, {
          params: {
            email,
          },
      });
    }
}
