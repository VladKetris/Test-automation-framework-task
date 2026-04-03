export type DemoblazeUser = {
    username: string;
    password: string;
    email: string;
};

export type DemoblazeProductDetails = {
    name: string;
    price: number;
    description: string;
    category: string;
};

export type DemoblazeProductExpectation = Omit<DemoblazeProductDetails, 'category'>;

export type ProductVerificationInput = {
    actual: DemoblazeProductDetails;
    expected: Partial<DemoblazeProductExpectation>;
};
