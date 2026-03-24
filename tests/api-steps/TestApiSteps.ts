import { step } from '@utils/decorators';
import { TestService } from '@api/services';
import { expect } from '@playwright/test';
import { StatusCode, SuccessResponseMessage } from '@api/constants';
import { assertSchema } from '@utils/parse-response';
import { CommonTestUserDetailsResponseSchema, CreateTestUserPayload, TestUserCredentials, GetTestUserDetailsResponseSchema } from '@api/schemas/TestSchema';

export class TestApiSteps {
    constructor(
        private readonly testService: TestService
    ) { }

    /**
     * Check if user with provided email exists
     * @returns boolean flag
     */
    @step('Check if user with provided email exists')
    async checkUserExists(email: string): Promise<boolean> {
        const userDetailsResponse = await this.testService.getUserDetails(email);
        await expect(userDetailsResponse).toHaveStatusCode(StatusCode.OK);
  
        const { user } = await assertSchema(userDetailsResponse, GetTestUserDetailsResponseSchema, 'Get Test User Details Response');
        return user.email === email && !!user.id;
    }

    /**
     * Delete method to delete user with check for user existance
     * @returns Raw API response containing status and message
     */
    @step('Delete user')
    async deleteUser(requestBody: TestUserCredentials): Promise<void> {
        const userExists = await this.checkUserExists(requestBody.email);
        expect(userExists, `User with email "${requestBody.email}" should exist before deletion`).toBeTruthy();

        const deleteUserResponse = await this.testService.deleteUser(requestBody);
        await expect(deleteUserResponse).toHaveStatusCode(StatusCode.OK);

        const { message } = await assertSchema(deleteUserResponse, CommonTestUserDetailsResponseSchema, 'Delete Test User Response');
        expect(message).toBe(SuccessResponseMessage.USER_DELETED);
    }

    /**
     * Post method for adding new test user
     * @returns Raw API response containing status and message
     */
    @step('Register new test user')
    async registerNewUser(requestBody: CreateTestUserPayload): Promise<void> {
        const newUserResponse = await this.testService.registerNewUser(requestBody);
        await expect(newUserResponse).toHaveStatusCode(StatusCode.OK);
        
        const { message, responseCode } = await assertSchema(newUserResponse, CommonTestUserDetailsResponseSchema, 'Create Test User Response');
        expect(responseCode).toBe(StatusCode.CREATED);
        expect(message).toBe(SuccessResponseMessage.USER_CREATED);
    }
}

