const mockAsyncCall = async (result) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, 0);
    });
};


module.exports = {
    mockAsyncCall
}