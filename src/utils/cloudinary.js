import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const setupCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
};

const uploadToCloudinary = async (filePath) => {
    try {
        if (!filePath) throw new Error('File path is required');
        const res = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });
        fs.unlinkSync(filePath); // This deletes the file from the local storage
        return res;
    } catch (error) {
        return null;
    }
};

export default uploadToCloudinary;
