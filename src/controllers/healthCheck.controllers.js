import TryCatchHandler from '../utils/TryCatchHandler';
import APIResponse from '../utils/APIResponse';

const healthCheck = TryCatchHandler(async (req, res) => {
    const response = new APIResponse(200, 'Health check successful', {});
    console.log('Health check successful');
    response.send(res);
});

export default healthCheck;
