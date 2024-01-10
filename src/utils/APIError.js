class APIError extends Error {
    constructor(statusCode, message, errors = [], stack = '') {
        super(message);
        this.status = statusCode;
        this.data = null;
        this.errors = errors;
        this.message = message;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    send(res) {
        res.status(this.status).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }
}

export default APIError;
