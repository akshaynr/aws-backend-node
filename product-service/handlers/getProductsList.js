'use strict';

import { mockAsyncCall } from '../mocks/async.mock';
import { productsMockData } from '../mocks/products.mock';
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES } from '../constants';;

export const getProductsList = async (event) => {
    console.log('[Get Products List] request, event:', event);
    const productsData = await mockAsyncCall(productsMockData);
    return formatResponse(STATUS_CODES.OK, productsData);
};