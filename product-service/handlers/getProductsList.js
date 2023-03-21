'use strict';

import { mockAsyncCall } from '../mocks/async.mock';
import { productsMockData } from '../mocks/products.mock';
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES, DYNAMODB_TABLES } from '../constants';
import { scan } from '../db/query';

/* Initial Implementation with mock data */
// export const getProductsList = async (event) => {
//     console.log('[Get Products List] request, event:', event);
//     const productsData = await mockAsyncCall(productsMockData);
//     return formatResponse(STATUS_CODES.OK, productsData);
// };

/* Integration with DynamoDB */
export const getProductsList = async (event) => {
    try{
        console.log('[Get Products List] request, event:', event);
        const productsData = await scan(DYNAMODB_TABLES.PRODUCTS_TABLE);
        const stocksData = await scan(DYNAMODB_TABLES.STOCKS_TABLE);
        const formattedProductsData = formatProductStocks(productsData, stocksData);
        return formatResponse(STATUS_CODES.OK, formattedProductsData);
    } catch(error){
        console.log('[Error Get Products List]', error);
        return formatResponse(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, { message: error.message });
    } 
};

const formatProductStocks = (products, stocks) => {
    try{
        products.map((element) => {
            element.count = 0;
            const productStockInfo = stocks.find((elem) => elem.product_id == element.id);
    
            if(productStockInfo){
                element.count = productStockInfo.count;
            }
    
            return element;
        });
    
        return products;
    } catch(error){
        throw error;
    }
}