'use strict';

import { mockAsyncCall } from '../mocks/async.mock';
import { productsMockData } from '../mocks/products.mock';
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES, DYNAMODB_TABLES } from '../constants';
import { transactWrite } from '../db/query';
import { validateProductSchema } from '../schema/product';
import { v4 as uuidv4 } from 'uuid';

// Initial Implementation with mock data
// export const getProductsList = async (event) => {
//     console.log('[Get Products List] request, event:', event);
//     const productsData = await mockAsyncCall(productsMockData);
//     return formatResponse(STATUS_CODES.OK, productsData);
// };

// Integration with DynamoDB
export const createProduct = async (event) => {
    try{
        console.log('[Create Product] request, event:', event);
        const productData = await validateProductSchema(JSON.parse(event.body));
        console.log('Validated Product:', productData);
        const { title, description, price, count } = productData;
        const product_id = uuidv4();
        const productDetails = {
            id: product_id,
            title, 
            description, 
            price
        };
        const stockDetails = {
            product_id,
            count
        };

        const transactUpdateItems = [{
            Put: {
                TableName: DYNAMODB_TABLES.PRODUCTS_TABLE,
                Item: productDetails
            },
        },{
            Put: {
                TableName: DYNAMODB_TABLES.STOCKS_TABLE,
                Item: stockDetails
            }
        }];

        await transactWrite(transactUpdateItems);
        return formatResponse(STATUS_CODES.CREATED, {...productData, id: product_id});
    } catch(error){
        console.log('[Error Create Product]', error);
        return formatResponse(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, {message: error.message});
    }
};