import { FRONTEND_URL } from '../constants'

const HEADERS = {
    'Access-Control-Allow-Origin': FRONTEND_URL,
    'Access-Control-Allow-Credentials': true
};

export const formatResponse = (statusCode, data) => {
    const response = {
        statusCode,
        headers: HEADERS,
        body: JSON.stringify(data)
    }
    console.log('Response:', response);
    return response;
};

