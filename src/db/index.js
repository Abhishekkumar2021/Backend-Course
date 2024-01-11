import mongoose from 'mongoose';

const connectToDatabase = async () => {
    console.log(process.env.MONGODB_URI)
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI
        );
        console.log(`Connected to database at ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        throw new Error('Database connection failed');
    }
};

export default connectToDatabase;
