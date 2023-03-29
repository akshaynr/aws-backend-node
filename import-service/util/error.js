import { STATUS_CODES, ERROR_MESSAGE } from '../constants';

export class HttpError extends Error {
    constructor (message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class InternalServerError extends HttpError {
    constructor () {
        super(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
}