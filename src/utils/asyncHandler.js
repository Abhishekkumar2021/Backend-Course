const asyncHandler = (callback) => {
    // callback is the function that will be passed to the route
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            res.status(err.code || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    };
}