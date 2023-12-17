import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

// Setting up the middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())
app.use(express.static("public"))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

export default app