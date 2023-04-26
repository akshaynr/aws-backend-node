import { formatResponse } from '../util/commonUtility'
import { STATUS_CODES, USER_CREDENTIALS, POLICY } from '../constants'; 

export const basicAuthorizer = async(event) => {
    try{
        const { methodArn, authorizationToken } = event;

        console.log('Event:', event);

        if(!authorizationToken){
            return formatResponse(STATUS_CODES.UNAUTHORIZED, { message: "UnAuthorized" });
        }

        const tokenDetails = authorizationToken.split(" ");
        console.log('Token Details:', tokenDetails);

        if(tokenDetails.length <= 1){
            return formatResponse(STATUS_CODES.UNAUTHORIZED, { message: "UnAuthorized" });
        };


        const encodedToken = tokenDetails[1];
        const decodedToken = Buffer.from(encodedToken, "base64").toString("utf8");
        const [userName, password] = decodedToken.split(":");
        console.log('Encoded:', encodedToken);
        console.log('Decoded:', decodedToken);
    
        const effect = userName === USER_CREDENTIALS.USERNAME && USER_CREDENTIALS.PASSWORD === password ? POLICY.ALLOW : POLICY.DENY;

        return generatePolicy(userName, effect, methodArn);
    } catch(error){
        console.log('[Error Basic Authorizer]', error);
        return formatResponse(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR, {message: error.message});
    }
}

const generatePolicy = (principalId, effect, resource) => {
    try{
        let authResponse = {};
        let policyDocument = {};
        authResponse.principalId = principalId;
        
        if (effect && resource) {
            policyDocument.Version = '2012-10-17'; 
            policyDocument.Statement = [];
            let statement = {};
            statement.Action = 'execute-api:Invoke'; 
            statement.Effect = effect;
            statement.Resource = resource;
            policyDocument.Statement[0] = statement;
            authResponse.policyDocument = policyDocument;
        };

        return authResponse;
    } catch(error){
        throw error;
    }
}