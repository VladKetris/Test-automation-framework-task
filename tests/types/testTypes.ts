export type TestProductDetails = {
    name: string;
    price: number;
};

export type TestProductCartDetails = TestProductDetails & {
    quantity: number;
    total: number;
};
