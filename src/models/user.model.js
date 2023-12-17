import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true,
        lowercase: true,
        index: true,
        maxLength: [50, "Username can not be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        lowercase: true,
        maxLength: [50, "Email can not be more than 50 characters"]
    },
    fullname: {
        type: String,
        required: [true, "Please provide your full name"],
        trim: true,
        index: true,
        maxLength: [50, "Full name can not be more than 50 characters"]
    },
    avatar: {
        type: String, // cloudinary image url
    },
    coverImage: {
        type: String, // cloudinary image url
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6, "Password can not be less than 6 characters"],
        select: false // don't return password when fetching user
    },
    refreshToken: {
        type: String,
        select: false
    },
}, { timestamps: true });


// Hooks
userSchema.pre("save", async function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    // hash the password
    this.password = bcrypt.hash(this.password, 12);

    // go to the next middleware
    next();
});

// Methods
userSchema.methods = {
    // Spread the default methods
    ...userSchema.methods,

    // check if password is correct
    async checkPassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    },

    // generate access token
    generateAccessToken() {
        return jwt.sign(
            { 
                _id: this._id,
                username: this.username,
                email: this.email,
                fullname: this.fullname,
            }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { 
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE
            }
        );
    },

    // generate refresh token
    generateRefreshToken() {
        return jwt.sign(
            { 
                _id: this._id,
            }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { 
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE
            }
        );
    }
}

const User = mongoose.model("User", userSchema);

export default User;