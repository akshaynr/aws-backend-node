const AWS = require('aws-sdk');

export const getDynamoDBConnection = () => {
    const DYNAMO = new AWS.DynamoDB.DocumentClient();
    return DYNAMO;
}

export const getSNSInstance = () => {
    const SNS = new AWS.SNS();
    return SNS;
}