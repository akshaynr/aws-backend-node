import { mockAsyncCall } from './async.mock';

describe("Async Mock Call", () => {
    test('return resolved data', async() => {
        const result = await mockAsyncCall(1);
        expect(result).toBe(1);
    });
});
