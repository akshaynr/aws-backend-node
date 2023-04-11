
import * as AWSMock from "aws-sdk-mock";
import { catalogBatchProcess } from '../handlers/catalogBatchProcess';
import { STATUS_CODES, ERROR_MESSAGE } from '../constants';

describe('catalogBatchProcess', () => {

    beforeEach(() => {
        AWSMock.mock('SNS', 'publish', (params, callback) => {
          callback(null, 'success');
        });
    });
    
    afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
    AWSMock.restore('SNS');
    });

    it('should create product and stock, publish a message to SNS, and return success response', async () => {
        AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params, callback) => {
            callback(null, 'success');
        });

        const event = {
        Records: [
            {
            body: JSON.stringify({
                id: '2e1769b0-5a8c-497d-81fa-dae30a4c9781',
                title: 'AmazFit',
                description: 'Test Description',
                price: 100,
                count: 55
            })
            }
        ]
        };

        const response = await catalogBatchProcess(event);

        expect(response.statusCode).toBe(STATUS_CODES.CREATED);
        expect(JSON.parse(response.body)).toEqual({ 
            product: event.Records.map(record => JSON.parse(record.body)) 
        })
    });

    it('should return an error response if an error occurs while creating product or stock/sns', async () => {

        AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params, callback) => {
            callback(new Error('ERROR'), null);
        });

        const event = {
        Records: [
            {
            body: JSON.stringify({
                id: '2e1769b0-5a8c-497d-81fa-dae30a4c9781',
                title: 'AmazFit',
                description: 'Test Description',
                price: 300,
                count: 13
            })
            }
        ]
        };

        const response = await catalogBatchProcess(event);

        expect(response.statusCode).toBe(STATUS_CODES.INTERNAL_SERVER_ERROR);
        expect(response.body).toEqual(JSON.stringify({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR
        }));
    });
});