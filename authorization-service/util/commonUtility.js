const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

const formatResponse = (statusCode, data) => {
    const response = {
        statusCode,
        headers: HEADERS,
        body: JSON.stringify(data)
    }
    console.log('Respose:', response);
    return response;
};


module.exports = {
    formatResponse
}

