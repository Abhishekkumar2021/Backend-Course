/* eslint-disable import/extensions */
import APIError from '../utils/APIError.js';
import APIResponse from '../utils/APIResponse.js';
import TryCatchHandler from '../utils/TryCatchHandler.js';
import User from '../models/user.model.js';
import uploadToCloudinary from '../utils/cloudinary.js';

const register = TryCatchHandler(async (req, res) => {
    // Get all the required fields
    const { email, password, username, fullname } = req.body;

    // verify the fields
    if (!email || !password || !username || !fullname)
        throw new APIError(400, 'Missing required fields');

    // Get the media files
    const avatarPath = (req.files?.avatar && req.files?.avatar[0]?.path) || '';
    const coverImagePath =
        (req.files?.coverImage && req.files?.coverImage[0]?.path) || '';

    // Verify if avatar is present or not
    if (!avatarPath) throw new APIError(400, 'Avatar file is required');

    // Upload the avatar to cloudinary
    const avatar = await uploadToCloudinary(avatarPath);
    if (!avatar) throw new APIError(400, 'Avatar file is required');

    // Upload the cover image to cloudinary
    const coverImage = await uploadToCloudinary(coverImagePath);

    // Create the user
    const user = await User.create({
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase(),
        fullname,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || '',
    });

    const createdUser = await User.findById(user._id);
    if (!createdUser)
        throw new APIError(500, 'Something went wrong while registering');

    const apiResponse = new APIResponse(200, 'User registered successfully', {
        user: createdUser,
    });
    apiResponse.send(res);
});

const login = TryCatchHandler(async (req, res) => {
    // Get the required fields
    const { email, username, password } = req.body;

    // Verify the fields
    if (!email && !username)
        throw new APIError(400, 'Email or username is required');

    // Find the user
    const user = await User.findOne({
        $or: [
            { email: email?.toLowerCase() },
            { username: username?.toLowerCase() },
        ],
    }).select('+password');

    // Verify the user
    if (!user) throw new APIError(400, 'Invalid username or email');

    // Verify the password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) throw new APIError(400, 'Invalid password');

    // Generate the tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Save the refresh token in the database
    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                refreshToken,
            },
        },
        {
            new: true,
        }
    );

    // Remove the password & refresh token from the user object
    user.password = undefined;

    // Set the cookies
    const options = {
        httpOnly: true,
        secure: true,
    };

    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);

    // Send the response
    const apiResponse = new APIResponse(200, 'User logged in successfully', {
        accessToken,
        refreshToken,
        user,
    });
    apiResponse.send(res);
});

const logout = TryCatchHandler(async (req, res) => {
    // Get the user
    const { user } = req;

    // Remove the refresh token
    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    // Clear the cookies
    const options = {
        httpOnly: true,
        secure: true,
    };

    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    // Send the response
    const apiResponse = new APIResponse(
        200,
        'User logged out successfully',
        {}
    );
    apiResponse.send(res);
});

const refreshAccessToken = TryCatchHandler(async (req, res) => {
    // Get the refresh token
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    // Verify the refresh token
    if (!refreshToken) throw new APIError(400, 'Refresh token is required');

    // Verify the refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) throw new APIError(400, 'Invalid refresh token');

    // Generate the new access token
    const accessToken = await user.generateAccessToken();

    // Set the cookie
    const options = {
        httpOnly: true,
        secure: true,
    };

    res.cookie('accessToken', accessToken, options);

    // Send the response
    const apiResponse = new APIResponse(
        200,
        'Access token refreshed successfully',
        { accessToken }
    );
    apiResponse.send(res);
});

// Change password
const changePassword = TryCatchHandler(async (req, res) => {
    // Get the user
    const user = await User.findById(req.user._id).select('+password');

    // Get the required fields
    const { oldPassword, newPassword } = req.body;

    // Verify the fields
    if (!oldPassword || !newPassword)
        throw new APIError(400, 'Missing required fields');

    // Verify the old password
    const isPasswordValid = await user.checkPassword(oldPassword);
    if (!isPasswordValid) throw new APIError(400, 'Invalid old password');

    // Update the password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    // Send the response
    const apiResponse = new APIResponse(
        200,
        'Password changed successfully',
        {}
    );
    apiResponse.send(res);
});

// Get current user
const getCurrentUser = TryCatchHandler(async (req, res) => {
    // Get the user
    const { user } = req;

    // Send the response
    const apiResponse = new APIResponse(
        200,
        'User details fetched successfully',
        { user }
    );
    apiResponse.send(res);
});

// Forgot password

// Reset password

// Update profile
const updateProfile = TryCatchHandler(async (req, res) => {
    // Get the user
    const { user } = req;

    // Get the required fields
    const { fullname, username, email } = req.body;

    // Verify the fields
    if (!email && !username && !fullname)
        throw new APIError(400, 'Missing required fields');

    // Update the fields
    if (email) user.email = email.toLowerCase();
    if (username) user.username = username.toLowerCase();
    if (fullname) user.fullname = fullname;

    // Save the user & validate the fields
    await user.save(); // by default it will validate the fields

    // Send the response
    const apiResponse = new APIResponse(200, 'Profile updated successfully', {
        user,
    });
    apiResponse.send(res);
});

// Update avatar
const updateAvatar = TryCatchHandler(async (req, res) => {
    // Get the user
    const { user } = req;

    // Get the avatar
    const avatarPath = req.file?.avatar || '';

    // Verify the avatar
    if (!avatarPath) throw new APIError(400, 'Avatar file is required');

    // Upload the avatar to cloudinary
    const avatar = await uploadToCloudinary(avatarPath);
    if (!avatar) throw new APIError(400, 'Avatar file is required');

    // Update the avatar
    user.avatar = avatar.secure_url;
    await user.save({ validateBeforeSave: false });

    // Send the response
    const apiResponse = new APIResponse(200, 'Avatar updated successfully', {
        user,
    });
    apiResponse.send(res);
});

// Update cover image
const updateCoverImage = TryCatchHandler(async (req, res) => {
    // Get the user
    const { user } = req;

    // Get the cover image
    const coverImagePath = req.file?.coverImage || '';

    // Verify the cover image
    if (!coverImagePath)
        throw new APIError(400, 'Cover image file is required');

    // Upload the cover image to cloudinary
    const coverImage = await uploadToCloudinary(coverImagePath);
    if (!coverImage) throw new APIError(400, 'Cover image file is required');

    // Update the cover image
    user.coverImage = coverImage.secure_url;
    await user.save({ validateBeforeSave: false });

    // Send the response
    const apiResponse = new APIResponse(
        200,
        'Cover image updated successfully',
        {
            user,
        }
    );
    apiResponse.send(res);
});

export {
    register,
    login,
    logout,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAvatar,
    updateCoverImage,
    updateProfile,
};
