import { Router } from "express";
import { 
    register,
    login,
    logout,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAvatar,
    updateCoverImage,
    updateProfile
} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/register")
    .post(
        upload.fields([
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 },
        ]),
        register
    );

router
    .route("/login")
    .post(login);

router
    .route("/refresh-token")
    .post(refreshAccessToken);

// Private routes
router
    .route("/logout")
    .post(auth, logout);

router
    .route("/change-password")
    .post(auth, changePassword);

router
    .route("/profile")
    .get(auth, getCurrentUser);

router
    .route("/avatar")
    .post(auth, upload.single("avatar"), updateAvatar);

router
    .route("/cover-image")
    .post(auth, upload.single("coverImage"), updateCoverImage);

router
    .route("/profile")
    .post(auth, updateProfile);


export default router;