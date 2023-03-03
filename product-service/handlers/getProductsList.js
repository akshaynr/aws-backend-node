'use strict';

import { mockAsyncCall } from '../mocks/async.mock';
import { productsMockData } from '../mocks/products.mock';

export const getProductsList = async (event) => {
    const productsData = await mockAsyncCall(productsMockData);
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(productsData)
    };
};