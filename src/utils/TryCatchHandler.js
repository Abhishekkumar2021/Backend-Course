import APIError from './APIError.js';

export default function TryCatchHandler(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            console.log(error.message);
            if (error instanceof APIError) {
                error.send(res);
            } else {
                const errorResponse = new APIError(
                    500,
                    error.message || 'Internal Server Error',
                    [],
                    error.stack
                );
                errorResponse.send(res);
            }
        }
    };
}
