import dotenv from "dotenv"
import connectToDatabase from "./db/index.js"
import app from "./app.js"
import { setupCloudinary } from "./utils/cloudinary.js"

dotenv.config()

const PORT = process.env.PORT || 5000

// To connect to the database and start the server
const connectAndStart = async () => {
    try {
        await connectToDatabase()
        await setupCloudinary()
        app.listen(PORT, () => {
            console.log(`You can access the server at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

connectAndStart() // To connect to the database and start the server
