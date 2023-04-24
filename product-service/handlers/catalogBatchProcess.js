import { getSNSInstance } from "../util/awsUtility";
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES, DYNAMODB_TABLES } from '../constants';
import { transactWrite } from '../db/query';

export const catalogBatchProcess = async (event) => {
    try{
        const productRecords = event.Records.map(record => JSON.parse(record.body));
        for(const productData of productRecords){
            const { id, title, description, price, count } = productData;
            const productDetails = {
                id,
                title, 
                description, 
                price
            };

            const stockDetails = {
                product_id: id,
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

            await sendNotification(productData);
        }

        return formatResponse(STATUS_CODES.CREATED, { product : productRecords });

    } catch(error){
        console.log('[Error Catalog Batch]', error);
        return formatResponse(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, {message: error.message});
    }
}

const sendNotification = async(data) => {
    try{
        const params = {
            Message: `Created ${JSON.stringify(data)} product`,
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
              price: {
                DataType: "Number",
                StringValue: String(data.price),
              },
            }
        };

        await getSNSInstance().publish(params).promise();
    } catch(error){
        console.log('Error:SNS', error);
        throw error;
    }
}