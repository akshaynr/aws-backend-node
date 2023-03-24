import * as AWSMock from "aws-sdk-mock";
import { importProductsFile } from "./importProductsFile";
import { AWS_BUCKET } from '../config'
import { STATUS_CODES } from '../constants'

const mockUrl = `https://${AWS_BUCKET.BUCKET_NAME}.s3.amazonaws.com/uploaded/test.csv`;

describe('importProductsFile', () => {
  const mockEvent = {
    queryStringParameters: {
      name: 'test.csv',
    },
  };

  afterEach(() => {
    AWSMock.restore();
  });

  it('returns signed URL when name parameter is present', async () => {
    AWSMock.mock('S3', 'getSignedUrlPromise', (callback) => {
      callback(null, mockUrl);
    });

    const result = await importProductsFile(mockEvent);
    const response = JSON.parse(result.body);
    expect(result.statusCode).toBe(STATUS_CODES.OK);
    expect(response.url).toContain(mockUrl);
  });

  it('returns an error when missing name parameter', async () => {
    const result = await importProductsFile({ queryStringParameters: {} });
    const response = JSON.parse(result.body);
    expect(result.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response).toEqual({ message: 'Invalid File Name' });
  });
});