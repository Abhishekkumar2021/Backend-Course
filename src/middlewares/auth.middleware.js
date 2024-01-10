import jwt from 'jsonwebtoken';
import process from 'process';
import User from '../models/user.model.js';
import APIError from '../utils/APIError.js';
import TryCatchHandler from '../utils/TryCatchHandler.js';

const auth = TryCatchHandler(async (req, res, next) => {
    // Get the token
    const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    // Verify the token
    if (!token) throw new APIError(401, 'Access denied. No token provided');

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user
    const user = await User.findById(decoded._id);

    // Verify the user
    if (!user) throw new APIError(401, 'Access denied. Invalid token provided');

    // Set the user
    req.user = user;

    // Go to the next middleware
    next();
});

export default auth;
