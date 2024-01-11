import TryCatchHandler from '../utils/TryCatchHandler.js';
import APIResponse from '../utils/APIResponse.js';

const healthCheck = TryCatchHandler(async (req, res) => {
    const response = new APIResponse(200, 'Health check successful', {});
    console.log('Health check successful');
    response.send(res);
});

export default healthCheck;
