import dotenv from "dotenv"
import connectToDatabase from "./db/index.js"
import app from "./app.js"

dotenv.config()

const PORT = process.env.PORT || 5000

// To connect to the database and start the server
const connectAndStart = async () => {
    try {
        await connectToDatabase()
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (error) {
        console.error("Error: ", error)
        process.exit(1)
    }
}

connectAndStart() // To connect to the database and start the server
