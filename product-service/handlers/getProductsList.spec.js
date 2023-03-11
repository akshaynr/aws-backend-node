import { getProductsList } from './getProductsList';
import { productsMockData } from '../mocks/products.mock';

describe("GetProducts" , () => {
    test('returns a list of products', async () => {
        const result = await getProductsList();
     
        expect(result.statusCode).toBe(200);
        expect(result.body).toBeTruthy();
        expect(Array.isArray(JSON.parse(result.body))).toBe(true);
        expect(JSON.parse(result.body)).toStrictEqual(productsMockData);
    }); 
});


