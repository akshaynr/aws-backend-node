'use strict';

import { mockAsyncCall } from '../mocks/async.mock';
import { productsMockData } from '../mocks/products.mock';
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES } from '../constants';

export const getProductsById = async (event) => {
    console.log('[Get Products List By ID] request, event:', event);

    const productsData = await mockAsyncCall(productsMockData);
    let productId = null;

    if(event && event.pathParameters && event.pathParameters.productId != null){
        productId = event.pathParameters.productId;
    } else{
        return formatResponse(STATUS_CODES.BAD_REQUEST, { message: "Invalid Product Id" });
    };

    const product = productsData.find((element) => element.id == productId);

    if(product){
        return formatResponse(STATUS_CODES.OK, product);
    } else{
        return formatResponse(STATUS_CODES.NOT_FOUND, { message: "Product Not Found" });
    }
};