import * as AWS from "aws-sdk";
import csv from "csv-parser";
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES } from '../constants';
import { AWS_BUCKET }  from '../config';

const s3Bucket = new AWS.S3({ region: AWS_BUCKET.BUCKET_REGION });
const sqs = new AWS.SQS();

export const importFileParser = async (event) => {
    try{
        const productData = [];
        for (const record of event.Records) {
            const readable = s3Bucket.getObject({
                Bucket: AWS_BUCKET.BUCKET_NAME,
                Key: record.s3.object.key
            }).createReadStream().pipe(csv());
    
            for await (const chunk of readable) {
                productData.push(chunk);
                
                await sendMessageToQueue(chunk);
            }
    
           // Copy File from uploaded folder to parsed folder
           await s3Bucket.copyObject({
                Bucket: AWS_BUCKET.BUCKET_NAME,
                CopySource: `${AWS_BUCKET.BUCKET_NAME}/${record.s3.object.key}`,
                Key: record.s3.object.key.replace('uploaded', 'parsed')
            }).promise();
    
          // Delete file from uploaded folder
          await s3Bucket.deleteObject({
                Bucket: AWS_BUCKET.BUCKET_NAME,
                Key: record.s3.object.key,
            }).promise();
    
          console.log("File Parser, file object moved.", record.s3.object.key);
        }
    
        return formatResponse(STATUS_CODES.CREATED, productData); 
    } catch(error){
        console.log('[Error Import File Parser]', error);
        return formatResponse(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, { message: error.message });
    }
}

const sendMessageToQueue = async(data) => {
    try{
        await sqs.sendMessage({
          QueueUrl: process.env.SQS_QUEUE_URL,
          MessageBody: JSON.stringify(data),
        }).promise();
    } catch(error){
        throw error;
    }
}