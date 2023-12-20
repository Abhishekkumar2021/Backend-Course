import mongoose from "mongoose"


const connectToDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to database at ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1); // 1 means exit with failure
    }
};

export default connectToDatabase;