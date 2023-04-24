import { getDynamoDBConnection } from '../util/awsUtility';
import { InternalServerError }  from '../util/error';


const scan = async(table_name) => {
    try{
        const result = await getDynamoDBConnection().scan({
            TableName: table_name
        }).promise();
        return result.Items;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}

const query = async(table_name, value, search_key = 'id') => {
    try{
        const result = await getDynamoDBConnection().query({
            TableName: table_name,
            KeyConditionExpression: `${search_key} = :id`,
            ExpressionAttributeValues : { ':id' : value }
        }).promise();
        return result.Items;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}

const create = async(table_name, item) => {
    try{
        const result = await getDynamoDBConnection().put({
            TableName: table_name,
            Item: item
        }).promise();
        return result;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}

const transactWrite = async(items) => {
    try{
        const result = await getDynamoDBConnection().transactWrite({
            TransactItems: items
        }).promise();
        console.log('Result Transaction:', result);
        return result;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}

const batchWrite = async(params) => {
    try{
        const result = await getDynamoDBConnection().batchWrite(params).promise();
        console.log('Result Batch Transaction:', result);
        return result;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}

export { scan, query, create, transactWrite, batchWrite };