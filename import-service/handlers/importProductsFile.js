import * as AWS from "aws-sdk";
import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES } from '../constants';
import { AWS_BUCKET }  from '../config';

const s3Bucket = new AWS.S3({ region: AWS_BUCKET.BUCKET_REGION });

export const importProductsFile = async (event) => {
    try{
        let fileName = null;

        if(event && event.queryStringParameters && event.queryStringParameters.name != null){
            fileName = event.queryStringParameters.name;
        } else{
            return formatResponse(STATUS_CODES.BAD_REQUEST, { message: "Invalid File Name" });
        };

        const filePath = `uploaded/${fileName}`;
    
        const params = {
            Bucket: AWS_BUCKET.BUCKET_NAME,
            Key: filePath,
            Expires: 60,
            ContentType: 'text/csv'
        };
    
        const url = await s3Bucket.getSignedUrlPromise('putObject', params);
        return formatResponse(STATUS_CODES.OK, { url })
    } catch(error){
        console.log('[Error Import Products File]', error);
        return formatResponse(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, { message: error.message }); 
    }
}