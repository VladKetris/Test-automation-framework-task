/**
 * Test API Routes
 * @see https://www.automationexercise.com/api_list
 */
export const TestApiRoutes = {
    /** create user endpoint */
    CREATE_USER: '/createAccount',
    /** delete user endpoint */
    DELETE_USER: '/deleteAccount',
    /** get user details endpoint */
    GET_USER: '/getUserDetailByEmail'
} as const;