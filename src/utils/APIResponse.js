class APIResponse {
    constructor(statusCode, message, data) {
        this.status = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }

    send(res) {
        res.status(this.status).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }
}

export default APIResponse;
