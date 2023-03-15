'use strict';

import { mockAsyncCall } from '../mocks/async.mock';
import { productsMockData } from '../mocks/products.mock';
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES, DYNAMODB_TABLES, DYNAMODB_TABLES_PRIMARY_KEY } from '../constants';
import { query } from '../db/query';


/* Initial Implementation with mock data */
// export const getProductsById = async (event) => {
//     console.log('[Get Products List By ID] request, event:', event);

//     const productsData = await mockAsyncCall(productsMockData);
//     let productId = null;

//     if(event && event.pathParameters && event.pathParameters.productId != null){
//         productId = event.pathParameters.productId;
//     } else{
//         return formatResponse(STATUS_CODES.BAD_REQUEST, { message: "Invalid Product Id" });
//     };

//     const product = productsData.find((element) => element.id == productId);

//     if(product){
//         return formatResponse(STATUS_CODES.OK, product);
//     } else{
//         return formatResponse(STATUS_CODES.NOT_FOUND, { message: "Product Not Found" });
//     }
// };

/* Integration with DynamoDB */
export const getProductsById = async (event) => {
    try{
        console.log('[Get Products List By ID] request, event:', event);
        let productId = null;
    
        if(event && event.pathParameters && event.pathParameters.productId != null){
            productId = event.pathParameters.productId;
        } else{
            return formatResponse(STATUS_CODES.BAD_REQUEST, { message: "Invalid Product Id" });
        };
    
        const [productsData, stocksData] = await Promise.all([
            query(DYNAMODB_TABLES.PRODUCTS_TABLE, productId, DYNAMODB_TABLES_PRIMARY_KEY.PRODUCTS_TABLE_PRIMARY),
            query(DYNAMODB_TABLES.STOCKS_TABLE, productId, DYNAMODB_TABLES_PRIMARY_KEY.STOCKS_TABLE_PRIMARY)
        ]);
        const product = productsData.find((element) => element.id == productId);
        const stockInfo = stocksData.find((element) => element.product_id == productId);
    
        if(product){
            return formatResponse(STATUS_CODES.OK, { ...product, count: stockInfo.count });
        } else{
            return formatResponse(STATUS_CODES.NOT_FOUND, { message: "Product Not Found" });
        }
    } catch(error){
        console.log('[Error Get Products List By ID]', error);
        return formatResponse(error.statusCode, { message: error.message });
    }
}; 