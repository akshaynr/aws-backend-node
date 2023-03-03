'use strict';

import { mockAsyncCall } from '../mocks/async.mock';
import { productsMockData } from '../mocks/products.mock';

export const getProductsById = async (event) => {
    console.log('[Get Products List By ID] request, event:', event);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    const productsData = await mockAsyncCall(productsMockData);
    let productId = null;

    if(event && event.pathParameters && event.pathParameters.productId != null){
        productId = event.pathParameters.productId;
    } else{
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: "Invalid Product Id" }),
        }
    };

    const product = productsData.find((element) => element.id == productId);

    if(product){
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(product),
        }
    } else{
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: "Product Not Found" }),
        }
    }
};