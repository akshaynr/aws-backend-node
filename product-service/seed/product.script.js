import { productsMockData } from '../mocks/products.mock';
import { transactWrite } from '../db/query';
import { STATUS_CODES, DYNAMODB_TABLES } from '../constants';
import { v4 as uuidv4 } from 'uuid';

const insertSeedData = async () => {
    try{
        await Promise.all(
            productsMockData.map(async (element) => {
                element.id = uuidv4();
                const { id, title, description, price, count } = element;
                const productDetails = { id, title, description, price };
                const stockDetails = { product_id: id, count };
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
            })
        );
        
        return formatResponse(STATUS_CODES.OK, productsMockData);
    } catch(error){
        console.log('[Error Seed Products Data]', error);
        return formatResponse(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, { message: error.message });
    }
}

const result = await insertSeedData();

