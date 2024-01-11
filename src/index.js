import dotenv from 'dotenv';
import connectToDatabase from './db/index.js';
import app from './app.js';
import { setupCloudinary } from './utils/cloudinary.js';
import { createTransporter, sendMail } from './utils/sendMail.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// To connect to the database and start the server
const connectAndStart = async () => {
    try {
        await connectToDatabase();
        await setupCloudinary();
        const transporter = await createTransporter();
        await sendMail(
            transporter,
            'tangocharlieandme@gmail.com',
            'Welcome to our website',
            '<h1>Hello world</h1>'
        );
        app.listen(PORT, () => {
            console.log(
                `You can access the server at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(error);
    }
};

connectAndStart(); // To connect to the database and start the server
