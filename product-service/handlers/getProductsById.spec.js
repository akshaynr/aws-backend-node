import { getProductsById } from './getProductsById';

const expectedProdctData = {
"count": 3,
"description": "Short Product Description7",
"id": "7567ec4b-b10c-45c5-9345-fc73c48a80a6",
"price": 15,
"title": "Airpods"
};

describe("GetProductsById", () => {

   it("Returns Product Details if found", async () => {
        const mockEventParameter = {
            pathParameters: {
                productId: "7567ec4b-b10c-45c5-9345-fc73c48a80a6",
            },
        };
        const result = await getProductsById(mockEventParameter);
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedProdctData));
    });

   it("Returns 404 error if product not found", async () => {
        const mockEventParameter = {
        pathParameters: {
            productId: "Testing-Invalid-Id",
        },
        };
        const result = await getProductsById(mockEventParameter);
        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body).message).toBe('Product Not Found');
    });

    it("Returns 400 error if product id in parameter is not found", async () => {
        const mockEventParameter = {
            pathParameters: {}
        };
        const result = await getProductsById(mockEventParameter);
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body).message).toBe('Invalid Product Id');
    });
});