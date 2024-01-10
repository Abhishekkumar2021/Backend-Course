import mongoose from 'mongoose';
import DB_NAME from '../constant.js';

const connectToDatabase = async () => {
    try {
        const conn = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`
        );
        console.log(`Connected to database at ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1); // 1 means exit with failure
    }
};

export default connectToDatabase;
