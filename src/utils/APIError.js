class APIError extends Error {
  constructor(
        statusCode,
        message = "Oh no! Something went wrong. Please try again later.",
        errors = [],
        stack = ""
    ) {
    super(message);
    this.status = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;
    this.success = false;

    if(stack) {
        this.stack = stack;
    } else {
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default APIError;